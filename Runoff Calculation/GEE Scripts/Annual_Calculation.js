
var soil = ee.Image("projects/ee-YOUR-ASSET-FOLDER-NAME/assets/HYSOGs250m"),
    srtm2 = ee.Image("USGS/SRTMGL1_003");

/*Any featurecollection here*/
var shape = /**/;

var geometry = shape.geometry();

var DEM = srtm2.clip(geometry);

// Calculating Slope
var slope = ee.Terrain.slope(DEM);

var size = shape.size();
var size1 = ee.Number(size).subtract(ee.Number(1));

// fc = ee.List(fc.toList(size));

var soil = soil.expression(
    "(b('b1') == 14) ? 4" +
      ": (b('b1') == 13) ? 3" +
        ": (b('b1') == 12) ? 2" +
         ": (b('b1') == 11) ? 1" +
           ": b('b1')"
).rename('soil');

soil = soil.clip(shape).rename('soil').reproject({
  crs:'EPSG:4326', 
  scale:30}
  );
  
var sy = ee.List(['2017-07-01', '2018-07-01', '2019-07-01', '2020-07-01', '2021-07-01', '2022-07-01']);
var ey = ee.List(['2018-06-30', '2019-06-30', '2020-06-30', '2021-06-30', '2022-06-30', '2023-06-30']);

var years = ee.List(['2017_2018', '2018_2019', '2019_2020', '2020_2021', '2021_2022', '2022_2023']);
var mws = ee.List.sequence(0,size1);
//***** LOOP *****//
for(var k= 0;k<6;k++)
{
  var s = sy.get(k);
  var e = ey.get(k);
  var lulc=ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1').filterDate(s, e);           

  var classification = lulc.select('label');
  
  var dwComposite = classification.reduce(ee.Reducer.mode());
  
  dwComposite = dwComposite.clip(shape).rename('label').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  lulc = dwComposite.rename(['lulc']);
  
  var lulc_soil = lulc.addBands(soil);
  lulc_soil=lulc_soil.unmask(0);
  
  var CN2 = lulc_soil.expression(
      "(b('soil') == 1) and(b('lulc')==0) ? 0" +
       ": (b('soil') == 1) and(b('lulc')==1) ? 30" +
          ": (b('soil') == 1) and(b('lulc')==2) ? 39" +
          ": (b('soil') == 1) and(b('lulc')==3) ? 0" +
          ": (b('soil') == 1) and(b('lulc')==4) ? 64" +
          ": (b('soil') == 1) and(b('lulc')==5) ? 39" +
          ": (b('soil') == 1) and(b('lulc')==6) ? 82" +
          ": (b('soil') == 1) and(b('lulc')==7) ? 49" +
          // Not considerting LULC 8 since it is for snow and ice
          
            ": (b('soil') == 2) and(b('lulc')==0) ? 0" +
            ": (b('soil') == 2) and(b('lulc')==1) ? 55" +
            ": (b('soil') == 2) and(b('lulc')==2) ? 61" +
            ": (b('soil') == 2) and(b('lulc')==3) ? 0" +
            ": (b('soil') == 2) and(b('lulc')==4) ? 75" +
            ": (b('soil') == 2) and(b('lulc')==5) ? 61" +
            ": (b('soil') == 2) and(b('lulc')==6) ? 88" +
            ": (b('soil') == 2) and(b('lulc')==7) ? 69" +
            
              ": (b('soil') == 3) and(b('lulc')==0) ? 0" +
              ": (b('soil') == 3) and(b('lulc')==1) ? 70" +
              ": (b('soil') == 3) and(b('lulc')==2) ? 74" +
              ": (b('soil') == 3) and(b('lulc')==3) ? 0" +
              ": (b('soil') == 3) and(b('lulc')==4) ? 82" +
              ": (b('soil') == 3) and(b('lulc')==5) ? 74" +
              ": (b('soil') == 3) and(b('lulc')==6) ? 91" +
              ": (b('soil') == 3) and(b('lulc')==7) ? 79" +
              
              "  : (b('soil') == 4) and(b('lulc')==0) ? 0" +
                ": (b('soil') == 4) and(b('lulc')==1) ? 77" +
                ": (b('soil') == 4) and(b('lulc')==2) ? 80" +
                ": (b('soil') == 4) and(b('lulc')==3) ? 0" +
                ": (b('soil') == 4) and(b('lulc')==4) ? 85" +
                ": (b('soil') == 4) and(b('lulc')==5) ? 80" +
                ": (b('soil') == 4) and(b('lulc')==6) ? 93" +
                ": (b('soil') == 4) and(b('lulc')==7) ? 84" +
                     ": (b('soil') == 0) ? 0" +
                    ": 0"
  ).rename('CN2');
  
  CN2 = CN2.clip(shape).rename('CN2').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  var CN1 = CN2.expression(
      '-75*CN2/(CN2-175)',{
        'CN2': CN2.select('CN2')
      }).rename('CN1'); 
  
  CN1 = CN1.clip(shape).rename('CN1').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  var CN3 = CN2.expression(
      'CN2*((2.718)**(0.00673*(100-CN2)))',{
        'CN2': CN2.select('CN2')
      }).rename('CN3'); 
        
  CN3 = CN3.clip(shape).rename('CN3').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  slope=slope.rename("slope");
  
  slope = slope.clip(shape).rename('slope').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  
  var part1=CN3.select('CN3').subtract(CN2.select('CN2')).divide(ee.Number(3)).rename("p1");
  
  part1 = part1.clip(shape).rename('p1').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
    
  var part2 = slope.expression(
      '1-(2*(2.718)**(-13.86*slope))',{
        'slope': slope.select('slope')
      }).rename('p2'); 
  
  part2 = part2.clip(shape).rename('p2').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
    
  var CN2a = slope.expression(
      'p1*p2+CN2',{
        'p1': part1.select('p1'),
        'p2': part2.select('p2'),
        'CN2': CN2.select('CN2')
      }).rename('CN2a');
  CN2a = CN2a.clip(shape).rename('CN2a').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  var CN1a = CN2a.expression(
      '4.2*CN2a/(10-0.058*CN2a)',{
        'CN2a': CN2a.select('CN2a')
      }).rename('CN1a'); 
  
  CN1a = CN1a.clip(shape).rename('CN1a').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  
  var CN3a = CN2a.expression(
      '23*CN2a/(10+0.13*CN2a)',{
        'CN2a': CN2a.select('CN2a')
      }).rename('CN3a');
  
  CN3a = CN3a.clip(shape).rename('CN3a').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  var sr1 = CN1a.expression(
      '(25400/CN1a)-254', {
        'CN1a': CN1a.select('CN1a')
  }).rename('sr1');
  
  sr1 = sr1.clip(shape).rename('sr1').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  
  var sr2 = CN2a.expression(
      '(25400/CN2a)-254', {
        'CN2a': CN2a.select('CN2a')
  }).rename('sr2');
  
  sr2 = sr2.clip(shape).rename('sr2').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  
  var sr3 = CN3a.expression(
      '(25400/CN3a)-254', {
        'CN3a': CN3a.select('CN3a')
  }).rename('sr3');
  
  sr3 = sr3.clip(shape).rename('sr3').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  var base = ee.Date(e);
  var ant = function(i)
  {
    var a = ee.Number(i).multiply(ee.Number(-1));
    var b = (ee.Number(i).multiply(ee.Number(-1))).subtract(ee.Number(1));
    var c = (ee.Number(i).multiply(ee.Number(-1))).subtract(ee.Number(4));
    var dtTo = base.advance(a, 'day').format('YYYY-MM-dd');
    var dtMid = base.advance(b, 'day').format('YYYY-MM-dd');
    var dtFrom = base.advance(c, 'day').format('YYYY-MM-dd');

    var dataset = ee.ImageCollection('JAXA/GPM_L3/GSMaP/v6/operational')
                      .filter(ee.Filter.date(dtFrom, dtTo));
                      
    var antecedent = dataset.reduce(ee.Reducer.sum());
    antecedent = antecedent.clip(shape).select('hourlyPrecipRate_sum').reproject({
      crs:'EPSG:4326', 
      scale:30}
      );
      
    var M2 = CN2a.expression(
        '0.5*(-sr+sqrt(sr**2+4*p*sr))', {
          'sr': sr2.select('sr2'),
          'p':antecedent.select('hourlyPrecipRate_sum')
    }).rename('m2');
    
    M2 = M2.clip(shape).rename('m2').reproject({
      crs:'EPSG:4326', 
      scale:30}
      );
    
    var M1 = CN2a.expression(
        '0.5*(-sr+sqrt(sr**2+4*p*sr))', {
          'sr': sr1.select('sr1'),
          'p':antecedent.select('hourlyPrecipRate_sum')
    }).rename('m1');
    
    M1 = M1.clip(shape).rename('m1').reproject({
      crs:'EPSG:4326', 
      scale:30}
      );
    
    var M3 = CN2a.expression(
        '0.5*(-sr+sqrt(sr**2+4*p*sr))', {
          'sr': sr3.select('sr3'),
          'p':antecedent.select('hourlyPrecipRate_sum')
    }).rename('m3');
    
    M3 = M3.clip(shape).rename('m3').reproject({
      crs:'EPSG:4326', 
      scale:30}
      );
    
    
    dataset = ee.ImageCollection('JAXA/GPM_L3/GSMaP/v6/operational')
                      .filter(ee.Filter.date(dtMid, dtTo));
    var total = dataset.reduce(ee.Reducer.sum());
    
    total = total.clip(shape).select('hourlyPrecipRate_sum').reproject({
      crs:'EPSG:4326', 
      scale:30}
      );

    var runoff = total.expression(
          '(P>=0.2*sr1) and (P5>=0) and (P5<=35) and (((P-0.2*sr1)*(P-0.2*sr1+m1))/(P+0.2*sr1+sr1+m1))>=0? ((P-0.2*sr1)*(P-0.2*sr1+m1))/(P+0.2*sr1+sr1+m1)' +
          ': (P>=0.2*sr2) and (P5>=0) and (P5>35) and (((P-0.2*sr2)*(P-0.2*sr2+m2))/(P+0.2*sr2+sr2+m2))>=0 ? ((P-0.2*sr2)*(P-0.2*sr2+m2))/(P+0.2*sr2+sr2+m2)' +
          ': (P>=0.2*sr3) and (P5>=0) and (P5>52.5) and (((P-0.2*sr3)*(P-0.2*sr3+m3))/(P+0.2*sr3+sr3+m3))>=0 ? ((P-0.2*sr3)*(P-0.2*sr3+m3))/(P+0.2*sr3+sr3+m3)' +
          ':0',
          {
          'P':total.select('hourlyPrecipRate_sum'),
          'm1':M1.select('m1'),
          'm2':M2.select('m2'),
          'm3':M3.select('m3'),
          'P5':antecedent.select('hourlyPrecipRate_sum'),
          'sr2':sr2.select('sr2'),
          'sr1':sr1.select('sr1'),
          'sr3':sr3.select('sr3')
        }).rename('runoff'); 
    return runoff
  };
  var ll = ee.List.sequence(0,364);
  
  var runoffs = ll.map(ant);
  runoffs = ee.ImageCollection(runoffs);
  
  var runoffTotal = runoffs.reduce(ee.Reducer.sum());
  
  runoffTotal = runoffTotal.clip(shape).select('runoff_sum').reproject({
    crs:'EPSG:4326', 
    scale:30}
    );
  
  var total=runoffTotal;
  total = total.clip(shape);
  total = total.select('runoff_sum');
  total = total.expression('p*30*30',{
      'p': total.select('runoff_sum')
    }).rename('p');
  var stats2 = total.reduceRegions({
    reducer: ee.Reducer.sum(),
    collection: shape,
    scale: 30,
    });
  var statsl = ee.List(stats2.toList(size));
  var y = years.get(k);
  var res = function(m){
    var f = ee.Feature(statsl.get(m));
    var id = f.get('uid');
    var feat = ee.Feature(shape.filter(ee.Filter.eq('uid', id)).first());
    var val = ee.Number(f.get('sum'));
    var a = ee.Number(feat.area());
    val = val.divide(a);
    return feat.set(y, val);
  };
  shape = ee.FeatureCollection(mws.map(res));
}



Export.table.toAsset({
  collection: shape,
  description:'Annual_Runoff',
  assetId: /*Asset ID of the asset to be exported*/
});


