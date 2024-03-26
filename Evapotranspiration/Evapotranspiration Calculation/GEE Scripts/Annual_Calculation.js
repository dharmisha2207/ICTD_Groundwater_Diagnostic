var shape = /*Any Featurecollection*/;


var fn=ee.ImageCollection.fromImages([image1, image2, image3, image4, image5, image6]);

var fsize = shape.size();
var fsize_ = ee.Number(fsize).subtract(ee.Number(1));

var mws = ee.List.sequence(0,fsize_);
fn = ee.List(fn.toList(6));

var year = ee.List(['2017_2018','2018_2019','2019_2020','2020_2021','2021_2022','2022_2023']);

for(var n = 0;n<6;n++)
{
  var baseimg = ee.Image(fn.get(n));

  var total = baseimg;
  total = total.clip(shape);
  total = total.select('b1');
  
// Total pixels
  var pixelCount = total.reduceRegions({
    reducer: ee.Reducer.count(),
    collection: shape,
    scale: 1113.1949079327353,
  });
  
  pixelCount = pixelCount.toList(fsize);
  print("PixelC", pixelCount);
  // Total Negative Pixels
  var negativePixels = total.lt(0); // 'lt' stands for less than (<) operator
  
  var negativePixelCount = negativePixels.reduceRegions({
    reducer: ee.Reducer.sum(),
    collection: shape,
    scale: 1113.1949079327353
  });
  
  print("Neg", negativePixelCount)
  var ll = function(k)
  {
    var pc = ee.Feature(pixelCount.get(k));
    var id = pc.get('uid');
    var nc = ee.Feature(negativePixelCount.filter(ee.Filter.eq('uid', id)).first());

    var p = ee.Number(pc.get('count'));
    nc = ee.Number(nc.get('sum'));
    var val = p.subtract(nc);
    return pc.set('tot',val);
  }
  
  var totalpix = ee.FeatureCollection(mws.map(ll));
  print("Total", totalpix)
  total = total.expression(
            'ET>0?86400*ET:0', {
              'ET': total.select('b1')
        });
// =======================================================================
  var stats2 = total.reduceRegions({
    reducer: ee.Reducer.sum(),
    collection: shape,
    scale: 1113.1949079327353,
  });
  
  var statsl = stats2.toList(fsize);
  
  var e = year.get(n);
  
  var res = function(m){
    var f = ee.Feature(statsl.get(m));
    var s = ee.Number(f.get('sum'));
    var id = f.get('uid');
    var feat = shape.filter(ee.Filter.eq('uid', id)).first();
    var pix = totalpix.filter(ee.Filter.eq('uid', id)).first();

    pix = ee.Number(pix.get('tot'));
    var val = s.divide(pix);
    return feat.set(e, val);
  };
  shape = ee.FeatureCollection(mws.map(res));
}


Export.table.toAsset({
  collection: shape,
  description: 'ETYearly_ET_Pindwara',
  assetId: 'projects/ee-dharmisha-siddharth/assets/Yearly_ET_Pindwara'
});
