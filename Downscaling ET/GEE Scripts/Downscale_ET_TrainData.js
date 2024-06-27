var modis_old = ee.ImageCollection("MODIS/061/MOD16A2GF"),
    modis = ee.ImageCollection("MODIS/061/MOD16A2"),
    train_areas_aez_1to5 = /*Load the AEZ training file provided with this repository as a featurecollection*/,
    humidData = ee.ImageCollection("NASA/GLDAS/V021/NOAH/G025/T3H"),
    landsat = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2"),
    train_0 = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[72.70889555310633, 24.81221369014938],
          [72.94510160779383, 24.814706704743912],
          [72.95883451795008, 25.011496063893],
          [72.72262846326258, 25.011496063893]]]),
    train_1 = /* color: #0b4a8b */ee.Geometry.Polygon(
        [[[76.15467833543174, 27.090600068824497],
          [76.38730019358567, 27.090600984707095],
          [76.4205429506333, 27.317203162483448],
          [76.17682361066926, 27.327046399302628]]]),
    train_2 = /* color: #ffc82d */ee.Geometry.Polygon(
        [[[85.10704234177318, 20.855094827790474],
          [85.35990847245343, 20.855094850562473],
          [85.35990990576566, 21.162996015884207],
          [85.11803515181025, 21.162996037711117]]]),
    train_3 = /* color: #00ffff */ee.Geometry.Polygon(
        [[[83.41761593569909, 19.094822071800536],
          [83.78563609604083, 19.115276509324666],
          [83.75312693783891, 19.431970781645045],
          [83.47177572032408, 19.452377993728785]]]),
    train_4 = /* color: #bf04c2 */ee.Geometry.Polygon(
        [[[78.641979855122, 22.17221402498959],
          [78.960583370747, 22.162039726975802],
          [78.905651730122, 22.487250772850125],
          [78.630993526997, 22.466947326349377]]]),
    train_5 = 
    /* color: #ff0000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[80.85015900448886, 24.161556413341835],
          [81.16923593349448, 24.20170500210832],
          [81.14723365640724, 24.50242032609612],
          [80.83915262507712, 24.492407765597697]]]),
    train_6 = /* color: #0000ff */ee.Geometry.Polygon(
        [[[81.51547176302006, 21.193916691348285],
          [81.83407527864506, 21.204159573224526],
          [81.83407527864506, 21.490670847896823],
          [81.53744441927006, 21.490670847896823]]]),
    train_7 = /* color: #999900 */ee.Geometry.Polygon(
        [[[84.04232723177006, 23.540600905176987],
          [84.37191707552006, 23.540600905176987],
          [84.36093074739506, 23.85246151988477],
          [84.07528621614506, 23.832363994971328]]]),
    train_8 = 
    /* color: #009999 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[86.13105466315547, 24.887537380401575],
          [86.27937009284297, 24.887537380401575],
          [86.29584958503047, 25.036938109802392],
          [86.16950681159297, 25.04689170523301]]]),
    train_9 = /* color: #ff00ff */ee.Geometry.Polygon(
        [[[87.54829099128047, 25.88997036837322],
          [87.70759274909297, 25.830653420303463],
          [87.71857907721797, 26.04306781440835],
          [87.48237302253047, 26.04306781440835]]]),
    train_10 = /* color: #d63000 */ee.Geometry.Polygon(
        [[[80.54695006056399, 27.906223123118785],
          [80.54695006056399, 27.68998744798579],
          [80.85456724806399, 27.68998744798579],
          [80.85456724806399, 27.906223123118785]]]);



var train_patches = ee.List([train_0, train_1, train_2, train_3, train_4, train_5, train_6, train_7, train_8, train_9, train_10]);
          // CONFIGURABLE PARAMETERS:
// AREA
var index = 0;
// var aez_patch = '1to5';
// var train_patch = train_areas_aez_1to5;
var train_patch = train_patches.get(index);

// DATES
var year = '2012';
var season = 3;

//-------THIS CODE IS CONFIGURED ACCORDING TO THE PARAMETERES SET ABOVE-------

// IMPORT THE TRAINING AREA GEOMETRIES AND NAMES FROM THE ASSETs

// var train_area_list = train_patch.toList(train_patch.size(), 0);
// var input_geom = ee.Feature(train_area_list.get(index)).geometry();
var input_geom = train_patch;
print(ee.Number(index).format('%d'));
var input_name = 'train_'.concat(ee.toString(index));
print(input_name);
var start = '2001-09-01';
var end = '2001-09-30';
if(season == 1){
  start = year+'-01-01';
  end = year+'-03-31';
}
else if(season == 2){
  start = year+'-04-01';
  end = year+'-06-30';
}
else if(season == 3){
  start = year+'-07-01';
  end = year+'-09-30';
}
else if(season == 4)
{
  start = year+'-10-01';
  end = year+'-12-31';
}
print('input name', input_name);
var folder= 'Train_Area_'+input_name;
var filename = year+'_'+season;

// Extract Landsat and Modis for required Dates:
var landsatmodified = landsat.filterDate(start,end);
var modismodify = modis_old.filterDate(start,end);
var humidity = humidData.filterDate(start,end); 

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

var small_landsat = landsatmodified.map(input_add);
var chkpoint_landsat = small_landsat.map(final_update);
var on_shape_landsat = chkpoint_landsat.filter(ee.Filter.gt('area',0.0));

var adddate = function(image){
  var ymd = ee.String(image.id()).slice(-8);
  var date = ee.String(ymd.slice(6,8));
  var month = ee.String(ymd.slice(4,6));
  var year = ee.String(ymd.slice(0,4));
  var img1 = image.set('year',year);
  img1 = img1.set('month',month);
  img1 = img1.set('date',date);
  return img1;
}
var modisadd = function(image){
  var ymd = ee.String(image.get('system:index'));
  var year = ee.String(ymd.slice(0,4));
  var month = ee.String(ymd.slice(5,7));
  var date = ee.String(ymd.slice(8,10));
  var img1 = image.set('year',year);
  img1 = img1.set('month',month);
  img1 = img1.set('date',date);
  return img1;
}
var humidadd = function(image){
  var ymd = ee.String(image.id());
  var year = ee.String(ymd.slice(1,5));
  var month = ee.String(ymd.slice(5,7));
  var date = ee.String(ymd.slice(7,9));
  var img1 = image.set('year',year);
  img1 = img1.set('month',month);
  img1 = img1.set('date',date);
  return img1;	
}


// Landsat and modis with dates as properties 
var landsat_date = on_shape_landsat.map(adddate);
Map.addLayer(landsat_date);

var date_print = function(image){
  var date = image.get('date');
  var month = image.get('month');
  var empt_fea = ee.Feature(null);
  var fea = empt_fea.set('date',date);
  var fea1 = fea.set('month',month);
  return fea1;
}

////// DATES OF LANDSAT
var dates = landsat_date.map(date_print);

var modis_date = modismodify.map(modisadd);

var humid_date = humidity.map(humidadd);

var one_img = modis_date.first();

var clipping = function(image){
  var newimg = image.clip(input_geom);
  return newimg;
}
var mean_et = function(image){
  var meanValue = image.select('ET').reduceRegion({
    reducer: ee.Reducer.mean(),
  });
  return ee.Feature(null).set('et',meanValue);
}

var modis_clipped = modis_date.map(clipping);

var dates_modis = modis_clipped.map(date_print);


var modis_dates_list = dates_modis.toList(dates_modis.size(),0);
var landsat_dates_list = dates.toList(dates.size(),0);



var mean_ET = modis_clipped.map(mean_et);




var add_modis = function(image){
  var newimg = image.set('mymodis',modis_date);
  return newimg;
}
var add_humid = function(image){
  var newimg = image.set('myhumid',humid_date);
  return newimg;
}
var landsat_withmodisr = landsat_date.map(add_modis);
var landsat_withmodis = landsat_withmodisr.map(add_humid);

var Strict_datematch = function(image){
  var modiscoll = image.get('mymodis');
  modiscoll = ee.FeatureCollection(modiscoll);
  var date_ls = ee.String((image.get('date')));
  var month_ls = ee.String((image.get('month')));
  var year_ls = ee.String((image.get('year')));
  var newmodiscoll = ee.List([]);
  var siz = modiscoll.size();

  var iter = function(img_modis,newmodiscoll){
    var date_modis = ee.String((img_modis.get('date')));
    var month_modis = ee.String((img_modis.get('month')));
    var year_modis = ee.String((img_modis.get('year')));
    var dateclose = function(date_m,date_l,month_m,month_l,year_m,year_l){
      // Write the date matching algorithm here // DONE DONE
      // Use only ee.Algorithm.if(condition,statement1,statement2);
      // For conditions : always use exp1.equals(exp2) (Otherwise will always gives false because it is gee boolean object(can't be used with normal object))
      var dm = ee.Number.parse(date_m);
      var mm = ee.Number.parse(month_m);
      var ym = ee.Number.parse(year_m);
      var dl = ee.Number.parse(date_l);
      var ml = ee.Number.parse(month_l);
      var yl = ee.Number.parse(year_l);
      var modisDate = ee.Date.fromYMD(ym,mm,dm);
      var lsDate = ee.Date.fromYMD(yl,ml,dl);
      var dateDiff = modisDate.difference(lsDate, 'day').abs();
      // CONFIGURABLE
      return dateDiff.lt(1);
    };
    return ee.Algorithms.If(dateclose(date_modis,date_ls,month_modis,month_ls,year_modis,year_ls),ee.List(newmodiscoll).add(img_modis),ee.List(newmodiscoll));
  }

  var modis_close_collection = modiscoll.iterate(iter,newmodiscoll);
  var newimg = image.set('closemodis',modis_close_collection);
  return newimg;
}

var datematch = function(image){
  var modiscoll = image.get('mymodis');
  modiscoll = ee.FeatureCollection(modiscoll);
  var date_ls = ee.String((image.get('date')));
  var month_ls = ee.String((image.get('month')));
  var year_ls = ee.String((image.get('year')));
  var newmodiscoll = ee.List([]);
  var siz = modiscoll.size();

  var iter = function(img_modis,newmodiscoll){
    var date_modis = ee.String((img_modis.get('date')));
    var month_modis = ee.String((img_modis.get('month')));
    var year_modis = ee.String((img_modis.get('year')));
    var dateclose = function(date_m,date_l,month_m,month_l,year_m,year_l){
      // Write the date matching algorithm here // DONE DONE
      // Use only ee.Algorithm.if(condition,statement1,statement2);
      // For conditions : always use exp1.equals(exp2) (Otherwise will always gives false because it is gee boolean object(can't be used with normal object))
      var dm = ee.Number.parse(date_m);
      var mm = ee.Number.parse(month_m);
      var ym = ee.Number.parse(year_m);
      var dl = ee.Number.parse(date_l);
      var ml = ee.Number.parse(month_l);
      var yl = ee.Number.parse(year_l);
      var modisDate = ee.Date.fromYMD(ym,mm,dm);
      var lsDate = ee.Date.fromYMD(yl,ml,dl);
      var dateDiff = modisDate.difference(lsDate, 'day');
      // CONFIGURABLE
      var datebool = dateDiff.lte(6).and(dateDiff.gte(0));
      return datebool;
    };
    return ee.Algorithms.If(dateclose(date_modis,date_ls,month_modis,month_ls,year_modis,year_ls),ee.List(newmodiscoll).add(img_modis),ee.List(newmodiscoll));
  }

  var modis_close_collection = modiscoll.iterate(iter,newmodiscoll);
  var newimg = image.set('closemodis',modis_close_collection);
  return newimg;
}
var datematch_humid = function(image){

  var modiscoll = image.get('myhumid');
  modiscoll = ee.FeatureCollection(modiscoll);
  var date_ls = ee.String((image.get('date')));
  var month_ls = ee.String((image.get('month')));
  var year_ls = ee.String((image.get('year')));
  var newmodiscoll = ee.List([]);
  var siz = modiscoll.size();
  
  var iter = function(img_modis,newmodiscoll){
    var date_modis = ee.String((img_modis.get('date')));
    var month_modis = ee.String((img_modis.get('month')));
    var year_modis = ee.String((img_modis.get('year')));
    var dateclose = function(date_m,date_l,month_m,month_l,year_m,year_l){
      // Write the date matching algorithm here // DONE DONE
      // Use only ee.Algorithm.if(condition,statement1,statement2);
      // For conditions : always use exp1.equals(exp2) (Otherwise will always gives false because it is gee boolean object(can't be used with normal object))
      var dm = ee.Number.parse(date_m);
      var mm = ee.Number.parse(month_m);
      var ym = ee.Number.parse(year_m);
      var dl = ee.Number.parse(date_l);
      var ml = ee.Number.parse(month_l);
      var yl = ee.Number.parse(year_l);
      var modisDate = ee.Date.fromYMD(ym,mm,dm);
      var lsDate = ee.Date.fromYMD(yl,ml,dl);
      var dateDiff = modisDate.difference(lsDate, 'day').abs();
      // CONFIGURABLE
      return dateDiff.lt(1);
    };
    return ee.Algorithms.If(dateclose(date_modis,date_ls,month_modis,month_ls,year_modis,year_ls),ee.List(newmodiscoll).add(img_modis),ee.List(newmodiscoll));
  }
  var modis_close_collection = ee.FeatureCollection(modiscoll).iterate(iter,newmodiscoll);
  var newimg = image.set('closehumid',modis_close_collection);
  return newimg;

}
var matched_landsatr = ee.ImageCollection(landsat_withmodis).map(datematch);
var matched_landsat = ee.ImageCollection(matched_landsatr).map(datematch_humid);

var sweetpoint = ee.ImageCollection(landsat_withmodis).map(Strict_datematch);

var modis_intersection = function(image){
  var close_modis = ee.List(image.get('closemodis'));
  var close_modis_inter = ee.List([]);
  var image_geom = image.geometry();
  var intersection_iter = function(img, close_modis_inter){
    var modi_img_geom = ee.Image(img).geometry();
    var intersected_geom = image_geom.intersection(modi_img_geom);
    var modi_img_intersected = ee.Image(img).clip(intersected_geom);
    return ee.List(close_modis_inter).add(modi_img_intersected);
  }
  var close_modis_intersected = close_modis.iterate(intersection_iter,close_modis_inter);
  var newimg = image.set('close_modis_inter',close_modis_intersected);
  var modis_size = ee.List(close_modis_intersected).size();
  newimg = newimg.set('modis_inter_size', modis_size);
  return newimg;
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


var landsat_modisintersectedr = matched_landsat.map(modis_intersection);
var landsat_modisintersected = landsat_modisintersectedr.map(humid_intersection);
print('landsat with near date modis and intersected',landsat_modisintersected);

landsat_modisintersected = landsat_modisintersected.filter(ee.Filter.gt('modis_inter_size', 0)); 
print('landsat with near date applying filter',landsat_modisintersected);
// Contains only images which have intersection with input file
// Contains the intersected landsat as property
// Contains the intesected modis as property
// Contains only images which have close modis date
// Map.addLayer(landsat_modisintersected);


// -------------------------- UPSCALING -----------------------------
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

var image_projection = landsat_modisintersected.first();

var close_modis = ee.List(image_projection.get('close_modis_inter'));

var close_modis_proj = ee.Image(close_modis.get(0));

var proj = close_modis_proj.projection();

var processImage = function(image) {
    return image.reduceResolution({
      reducer: ee.Reducer.mean(),
      bestEffort: true,
      maxPixels: 64
    }).reproject({
      crs: proj
    });
}

var landsat_orig_res = landsat_modisintersected.map(calculate);

var landsat_resampr = landsat_modisintersected.map(processImage).map(calculate);

///////////// RESAMPLING DONE, NOW ADDING ET AND OTHER FEATURES AS BANDS /////////

var add_humid = function(image){
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
  var newimg14 = ee.Image(newimg).select('Qle_tavg').reproject(proj).rename('qle');
  var newimg15 = ee.Image(newimg).select('Qh_tavg').reproject(proj).rename('qh');
  var newimg16 = ee.Image(newimg).select('Qg_tavg').reproject(proj).rename('qg');
  var newimg17 = ee.Image(newimg).select('Swnet_tavg').reproject(proj).rename('swnet');
  var newimg18 = ee.Image(newimg).select('Lwnet_tavg').reproject(proj).rename('lwnet');
  var newimg19 = ee.Image(newimg).select('Tair_f_inst').reproject(proj).rename('tair');
  var newimage = image.addBands([newimg2,newimg3,newimg4,newimg5,newimg6,newimg7,newimg8,newimg9,newimg10,newimg11,newimg12, newimg14, newimg15, newimg16, newimg17, newimg18, newimg19]);
  return newimage;
}

var addBandET =function(image){
  var modisimage_s = ee.Image(ee.List(image.get('close_modis_inter')).get(0)).select('ET');
  var finalimage_s = image.addBands(modisimage_s);
  return finalimage_s;
}

var clipimage = function(image){
  var clipped = ee.Image(image).clip(input_geom);
  return clipped;
}
print("Landsat resampled :",landsat_resampr);

var landsat_500_a = landsat_resampr.map(add_humid);

print("Humid added: ", landsat_500_a.size());
var landsat_500 = landsat_500_a.map(addBandET);
print("ET added: ", landsat_500.size());
var landsat_30 = landsat_orig_res.map(add_humid);
var clipped_landsat_500 = landsat_500.map(clipimage);

var clipped_landsat_30 = landsat_30.map(clipimage);




//////////// BAND ADDED, GENERATING DATASET /////////////
/////////// USE GIVEN COLLECTIONS (landsat_500, landsat_30, clipped_landsat_500, clipped_landsat_30) accordingly.



var listsize = ee.Number(clipped_landsat_500.size());
var myList = ee.List.sequence(0, listsize.subtract(1));

function extractTrainData(number){
    var modellist_s = (clipped_landsat_500.toList(1,number));
    var finalimage_s = ee.Image(modellist_s.get(0));
    var trainingData2 = finalimage_s.sample({
      scale: 500,
      seed: 5,
      numPixels: 200
    });
    return trainingData2;
}

var trainingList = myList.map(extractTrainData);


var mergeCollections = function(collection, current) {
  return ee.FeatureCollection(current).merge(ee.FeatureCollection(collection));
};

var trainingData = ee.FeatureCollection([]);

var traindata_500 = ee.FeatureCollection(ee.List(trainingList).iterate(mergeCollections, trainingData));

print("Train size: ", traindata_500.size());

var bands = ['MSAVI','NDMI','NDVI','NDWI','SAVI','NDBI','NDIIB7','ALBEDO','LST','humid','rain','temp','psurf','canopy','sm','wind','root','soiltemp', 'runoff', 'sw','qle','qh','qg','swnet','lwnet','tair','ET'];
 
Export.table.toDrive({
  collection: traindata_500,
  description: filename,
  selectors:bands,
  fileFormat: 'CSV',
  fileNamePrefix: filename,
  folder : folder
});

Map.addLayer(landsat_500);
