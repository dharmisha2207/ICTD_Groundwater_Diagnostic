var landsat = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2");

// Below are examples of some locations that we worked on
var dantiwada = ee.Geometry.Point(72.483333,24.166667);
var jodhpur = ee.Geometry.Point(73.016667,26.3);
var durgapura = ee.Geometry.Point(75.783333,26.85);
var jhansi = ee.Geometry.Point([78.889537, 25.852412]);
var newdelhi = ee.Geometry.Point([77.333333,29.01666]);
var rajkot = ee.Geometry.Point([71.516667,22.533333]);
var anand = ee.Geometry.Point(73.633333,22.9);
var bikramganj = ee.Geometry.Point(84.25,25.166667);
var varanasi = ee.Geometry.Point(83.65082,25.44757);
var bhopal = ee.Geometry.Point(77.666667,23.5);
var raipur = ee.Geometry.Point(82.433333,21.266667);
var lucknow = ee.Geometry.Point(81.557722,27.339713);

// 
var point = /*Any Location declared above*/;

Map.addLayer(point,{},'point');

point = point.buffer(30);

var origpoint = point;
var input_geom = point;

var start = '2001-01-01';
var end = '2010-01-01';

var clipimage = function(image){
  var clipped = ee.Image(image).clip(input_geom);
  return clipped;
}

var landsatimg = landsat.filterDate(start,end).filterBounds(input_geom);
landsatimg = landsatimg.map(clipimage);

print(landsatimg);
print(landsatimg.size());

var proj = ee.Projection({
  crs: 'SR-ORG:6974',
  transform: [463.3127165279165, 0, -20015109.354, 0, -463.3127165279167, 8895604.157336]
});


var input_add = function(image){
  var newimg = image.set('input',input_geom);
  return newimg;
}

var final_update = function(image){
  var input_geom = ee.Feature(image.get('input')).geometry();
  var mygeom = image.geometry();
  var ls_geom = mygeom.intersection(input_geom);
  var area = ee.Number.parse(ls_geom.area());
  var newimg = image.set('area',area);
  return newimg;
}

landsatimg = landsatimg.map(input_add);
landsatimg = landsatimg.map(final_update);
landsatimg = landsatimg.filter(ee.Filter.gt('area',0.0));

var adddate = function(image){
  var ymd = ee.String(ee.Image(image).id()).slice(-8);
  var date = ee.String(ymd.slice(6,8));
  var month = ee.String(ymd.slice(4,6));
  var year = ee.String(ymd.slice(0,4));
  var img1 = ee.Image(image).set('year',year);
  img1 = img1.set('month',month);
  img1 = img1.set('date',date);
  return img1;
}
var landsatimg = landsatimg.map(adddate);


var assetName = /*Enter the path of the random forest model(Landsat 7 model or Landsat 8 model according to usecase)*/;

var calculate = function(image) {
  var ndvi = image.normalizedDifference(['SR_B4', 'SR_B3']).rename('NDVI');
  var savi = image.expression("((NIR-R)/(NIR+R+L))*(1+L)",{
    "NIR": image.select('SR_B4'),
    "R": image.select('SR_B3'),
    "L": 0.5
  }).rename("SAVI"); 
  var ndbi = image.expression("(SWIR - NIR)/(SWIR+NIR)", {
    "SWIR": image.select('SR_B5'),
    "NIR": image.select('SR_B4')
  }).rename("NDBI");
  var ndwi = image.expression("(green-NIR)/(green+NIR)", {
    "green": image.select('SR_B2'),
    "NIR": image.select('SR_B4')
  }).rename("NDWI");
  var ndmi = image.expression("(NIR-SWIR1)/(NIR+SWIR1)", {
    "NIR":image.select('SR_B4'),
    "SWIR1": image.select('SR_B5')
  }).rename("NDMI");
  var ndiib7 = image.expression("(NIR-SWIR2)/(NIR+SWIR2)",{
    "NIR":image.select('SR_B4'),
    "SWIR2": image.select('SR_B7')
  }).rename("NDIIB7");
  var msavi = image.expression("(2 * NIR + 1 - sqrt(pow((2 * NIR + 1), 2) - 8 * (NIR - R)) ) / 2", {
    "NIR":image.select('SR_B4'),
    "R":image.select('SR_B3')
  }).rename("MSAVI");
  var lst = image.expression("K1 * BT + K2" ,{
    'BT': image.select('ST_B6'),
    'K1': 0.00341802,
    'K2': 149.0
  }).rename('LST');
  var albedo = image.expression("((0.130*B2) + (0.373*B3) + (0.085*B4) + (0.072*B5) -0.018) / 1.016",{
  // 'B1': image.select('SR_B1'),
  'B2': image.select('SR_B1'),
  'B3': image.select('SR_B2'),
  'B4': image.select('SR_B3'),
  'B5': image.select('SR_B4'),
  }).rename('ALBEDO');
  return image.addBands([ndvi, savi, ndbi, ndmi, ndwi, ndiib7, msavi, albedo, lst]);
}

var processImage = function(image) {
    return image.reduceResolution({
      reducer: ee.Reducer.mean(),
      bestEffort: true,
      maxPixels: 64
    }).reproject({
      crs: proj
    });
}



var humid = function(image){
  var y = ee.String(image.get('year'));
  var m = ee.String(image.get('month'));
  var d = ee.String(image.get('date'));
  var s = (((y.cat("-")).cat(m)).cat("-")).cat(d);
  var e = ee.Date(s).advance(1,'day');
  var newimg = (ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H').filterDate(s,e)).toList(8);
  return image.set('closehumid', newimg);
}

var humid_intersection = function(image){
  var close_modis = ee.List(image.get('closehumid'));
  var close_modis_inter = ee.List([]);
  var image_geom = image.geometry();
  var intersection_iter = function(img, close_modis_inter){
    var modi_img_geom = ee.Image(img).geometry();
    var intersected_geom = image_geom.intersection(modi_img_geom);
    var modi_img_intersected = ee.Image(img).clip(intersected_geom);
    return ee.List(close_modis_inter).add(modi_img_intersected);
  }
  var close_modis_intersected = close_modis.iterate(intersection_iter,close_modis_inter);
  var newimg = image.set('close_humid_inter',close_modis_intersected);
  return newimg;
}

var add_humid = function(image){
  var proj = image.projection();
  var newimg = ee.List(image.get('close_humid_inter')).get(0);
  var newimg2 = ee.Image(newimg).select('Qair_f_inst').reproject(proj).rename('humid');
  var newimg3 = ee.Image(newimg).select('Rainf_tavg').reproject(proj).rename('rain');
  var newimg4 = ee.Image(newimg).select('AvgSurfT_inst').reproject(proj).rename('temp');
  var newimg5 = ee.Image(newimg).select('Psurf_f_inst').reproject(proj).rename('psurf');
  var newimg6 = ee.Image(newimg).select('CanopInt_inst').reproject(proj).rename('canopy');
  var newimg7 = ee.Image(newimg).select('SoilMoi0_10cm_inst').reproject(proj).rename('sm');
  var newimg8 = ee.Image(newimg).select('Wind_f_inst').reproject(proj).rename('wind');
  var newimg9 = ee.Image(newimg).select('RootMoist_inst').reproject(proj).rename('root');
  var newimg10 = ee.Image(newimg).select('SoilTMP0_10cm_inst').reproject(proj).rename('soiltemp');
  var newimg11 = ee.Image(newimg).select('Qsb_acc').reproject(proj).rename('runoff');
  var newimg12 = ee.Image(newimg).select('SWdown_f_tavg').reproject(proj).rename('sw');
  var newimg13 = ee.Image(newimg).select('LWdown_f_tavg').reproject(proj).rename('lw');
  var newimg14 = ee.Image(newimg).select('Qle_tavg').reproject(proj).rename('qle');
  var newimg15 = ee.Image(newimg).select('Qh_tavg').reproject(proj).rename('qh');
  var newimg16 = ee.Image(newimg).select('Qg_tavg').reproject(proj).rename('qg');
  var newimg17 = ee.Image(newimg).select('Swnet_tavg').reproject(proj).rename('swnet');
  var newimg18 = ee.Image(newimg).select('Lwnet_tavg').reproject(proj).rename('lwnet');
  var newimg19 = ee.Image(newimg).select('Tair_f_inst').reproject(proj).rename('tair');
  // var newimg = ee.List(image.get('close_humid_inter')).get(0);
  // var newimg2 = ee.Image(newimg).select('Qair_f_inst').rename('humid');
  // var newimg3 = ee.Image(newimg).select('Rainf_tavg').rename('rain');
  // var newimg4 = ee.Image(newimg).select('AvgSurfT_inst').rename('temp');
  // var newimg5 = ee.Image(newimg).select('Psurf_f_inst').rename('psurf');
  // var newimg6 = ee.Image(newimg).select('CanopInt_inst').rename('canopy');
  // var newimg7 = ee.Image(newimg).select('SoilMoi0_10cm_inst').rename('sm');
  // var newimg8 = ee.Image(newimg).select('Wind_f_inst').rename('wind');
  // var newimg9 = ee.Image(newimg).select('RootMoist_inst').rename('root');
  // var newimg10 = ee.Image(newimg).select('SoilTMP0_10cm_inst').rename('soiltemp');
  // var newimg11 = ee.Image(newimg).select('Qsb_acc').rename('runoff');
  // var newimg12 = ee.Image(newimg).select('SWdown_f_tavg').rename('sw');
  // var newimg13 = ee.Image(newimg).select('LWdown_f_tavg').rename('lw');
  // var newimg14 = ee.Image(newimg).select('Qle_tavg').rename('qle');
  // var newimg15 = ee.Image(newimg).select('Qh_tavg').rename('qh');
  // var newimg16 = ee.Image(newimg).select('Qg_tavg').rename('qg');
  // var newimg17 = ee.Image(newimg).select('Swnet_tavg').rename('swnet');
  // var newimg18 = ee.Image(newimg).select('Lwnet_tavg').rename('lwnet');
  // var newimg19 = ee.Image(newimg).select('Tair_f_inst').rename('tair');
  var newimage = image.addBands([newimg2,newimg3,newimg4,newimg5,newimg6,newimg7,newimg8,newimg9,newimg10,newimg11,newimg12, newimg13, newimg14, newimg15, newimg16, newimg17, newimg18, newimg19]);
  return newimage;
}


var RandomForestasFeatCollection = ee.FeatureCollection(assetName).aggregate_array('tree');
var classifier = ee.Classifier.decisionTreeEnsemble(RandomForestasFeatCollection);


// image = image.map(processImage);
landsatimg = landsatimg.map(humid);

var imagecoll = landsatimg.map(humid_intersection);
// print(imagecoll);
imagecoll = imagecoll.map(calculate);
imagecoll = imagecoll.map(add_humid);

print(imagecoll);


var featurebands = ['MSAVI','NDMI','NDVI','NDWI','SAVI','NDBI','NDIIB7','ALBEDO','LST','humid','rain','temp','psurf','canopy','sm','wind','root','soiltemp', 'runoff', 'sw', 'qle','qh','qg','swnet','lwnet','tair'];
// Map.addLayer(point);
// Map.addLayer(imagecoll.first());
// Map.centerObject(point);
// print(classifier);
var compute = function(image){
  // var image = imagecoll.first();
  var feature_image_30 = image.select(featurebands);
  var predicted_et_30 = feature_image_30.classify(classifier);
  // Map.addLayer(predicted_et_30, {}, "p");
  // print(predicted_et_30);
  // print(predicted_et_30.sample(origpoint, 30).first().get('classification'));
  // var val = predicted_et_30.reduceRegion({
  // reducer: ee.Reducer.mean(), // Use ee.Reducer.mean() for computing the mean
  // geometry: point,
  // scale: 30 })
  // print(val);
  var y = ee.String(image.get('year'));
  var m = ee.String(image.get('month'));
  var d = ee.String(image.get('date'));
  var s = (((y.cat("-")).cat(m)).cat("-")).cat(d);
  // print(s);
  // var et = val.get('classification');
  // print(predicted_et_30);
  predicted_et_30 = predicted_et_30.sample(origpoint, 30);
  // print(predicted_et_30);
  var size = predicted_et_30.size();
  var et = ee.Algorithms.If(size, predicted_et_30.first().get('classification'), 0);
  et =ee.Number(et).multiply(0.1);
  // var et = predicted_et_30.sample(origpoint, 30).first().get('classification');
  // et = ee.Algorithms.If(et,et,0);
  var outStr = ee.String(s).cat(ee.String('=')).cat(et);
  return ee.Feature(null).set('et',outStr);
  // print(outStr);
}


var res = imagecoll.map(compute);
print(res);
print(res.aggregate_array('et'));