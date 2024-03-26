/*Any featurecollection here*/
var shape = /**/;

var nf = shape.size();
var start_dates = ee.List([
  '2017-07-01',
  '2018-07-01',
  '2019-07-01',
  '2020-07-01',
  '2021-07-01',
  '2022-07-01',
  
]);

var end_dates = ee.List([
  '2018-06-30',
  '2019-06-30',
  '2020-06-30',
  '2021-06-30',
  '2022-06-30',
  '2023-06-30',
]);

var x = ee.Number(nf).subtract(1);
var mws = ee.List.sequence(0,x);

var fc = ee.FeatureCollection(shape);

var years = ee.List(['2017_2018','2018_2019','2019_2020','2020_2021','2021_2022','2022_2023']);

for(var i = 0; i<6; i++)
{
  var s = start_dates.get(i);
  var e = end_dates.get(i);
  var y = years.get(i);
  var dataset = ee.ImageCollection('JAXA/GPM_L3/GSMaP/v6/operational')
                  .filter(ee.Filter.date(s, e));
  var total = dataset.reduce(ee.Reducer.sum());
  total = total.clip(shape).reproject({
  crs:'EPSG:4326', 
  scale:11132}
  );
  var stats2 = total.reduceRegions({
    reducer: ee.Reducer.mean(),
    collection: shape,
    scale: 11132,
    });
  var statsl = ee.List(stats2.toList(nf));
 
  var res = function(m){
    var feat = ee.Feature(statsl.get(m));

    var id = feat.get('uid');
    var f = ee.Feature(fc.filter(ee.Filter.eq('uid', id)).first());
    var val = ee.Number(feat.get('hourlyPrecipRate_sum'));
    val = ee.Algorithms.If(val, val, 0);
    return f.set(y, val);

  };
  fc = ee.FeatureCollection(mws.map(res));
}


Export.table.toAsset({
  collection: fc,
  description:'Annual_Prec',
  assetId: /*Asset ID of the asset to be exported*/
});
