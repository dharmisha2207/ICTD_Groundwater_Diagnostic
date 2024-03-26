var soil = ee.Image("projects/ee-YOUR-ASSET-FOLDER-NAME/assets/HYSOGs250m"),
    srtm2 = ee.Image("USGS/SRTMGL1_003");
    
var start_dates = ee.List([
    '2017-07-01',
    '2017-07-15',
    '2017-07-29',
    '2017-08-12',
    '2017-08-26',
    '2017-09-09',
    '2017-09-23',
    '2017-10-07',
    '2017-10-21',
    '2017-11-04',
    '2017-11-18',
    '2017-12-02',
    '2017-12-16',
    '2017-12-30',
    '2018-01-13',
    '2018-01-27',
    '2018-02-10',
    '2018-02-24',
    '2018-03-10',
    '2018-03-24',
    '2018-04-07',
    '2018-04-21',
    '2018-05-05',
    '2018-05-19',
    '2018-06-02',
    '2018-06-16',
    '2018-07-01',
    '2018-07-15',
    '2018-07-29',
    '2018-08-12',
    '2018-08-26',
    '2018-09-09',
    '2018-09-23',
    '2018-10-07',
    '2018-10-21',
    '2018-11-04',
    '2018-11-18',
    '2018-12-02',
    '2018-12-16',
    '2018-12-30',
    '2019-01-13',
    '2019-01-27',
    '2019-02-10',
    '2019-02-24',
    '2019-03-10',
    '2019-03-24',
    '2019-04-07',
    '2019-04-21',
    '2019-05-05',
    '2019-05-19',
    '2019-06-02',
    '2019-06-16',
    '2019-07-01',
    '2019-07-15',
    '2019-07-29',
    '2019-08-12',
    '2019-08-26',
    '2019-09-09',
    '2019-09-23',
    '2019-10-07',
    '2019-10-21',
    '2019-11-04',
    '2019-11-18',
    '2019-12-02',
    '2019-12-16',
    '2019-12-30',
    '2020-01-13',
    '2020-01-27',
    '2020-02-10',
    '2020-02-24',
    '2020-03-09',
    '2020-03-23',
    '2020-04-06',
    '2020-04-20',
    '2020-05-04',
    '2020-05-18',
    '2020-06-01',
    '2020-06-15',
    '2020-07-01',
    '2020-07-15',
    '2020-07-29',
    '2020-08-12',
    '2020-08-26',
    '2020-09-09',
    '2020-09-23',
    '2020-10-07',
    '2020-10-21',
    '2020-11-04',
    '2020-11-18',
    '2020-12-02',
    '2020-12-16',
    '2020-12-30',
    '2021-01-13',
    '2021-01-27',
    '2021-02-10',
    '2021-02-24',
    '2021-03-10',
    '2021-03-24',
    '2021-04-07',
    '2021-04-21',
    '2021-05-05',
    '2021-05-19',
    '2021-06-02',
    '2021-06-16',
    '2021-07-01',
    '2021-07-15',
    '2021-07-29',
    '2021-08-12',
    '2021-08-26',
    '2021-09-09',
    '2021-09-23',
    '2021-10-07',
    '2021-10-21',
    '2021-11-04',
    '2021-11-18',
    '2021-12-02',
    '2021-12-16',
    '2021-12-30',
    '2022-01-13',
    '2022-01-27',
    '2022-02-10',
    '2022-02-24',
    '2022-03-10',
    '2022-03-24',
    '2022-04-07',
    '2022-04-21',
    '2022-05-05',
    '2022-05-19',
    '2022-06-02',
    '2022-06-16',
    '2022-07-01',
    '2022-07-15',
    '2022-07-29',
    '2022-08-12',
    '2022-08-26',
    '2022-09-09',
    '2022-09-23',
    '2022-10-07',
    '2022-10-21',
    '2022-11-04',
    '2022-11-18',
    '2022-12-02',
    '2022-12-16',
    '2022-12-30',
    '2023-01-13',
    '2023-01-27',
    '2023-02-10',
    '2023-02-24',
    '2023-03-10',
    '2023-03-24',
    '2023-04-07',
    '2023-04-21',
    '2023-05-05',
    '2023-05-19',
    '2023-06-02',
    '2023-06-16'
    ]);
    
    var end_dates = ee.List([
    '2017-07-14',
    '2017-07-28',
    '2017-08-11',
    '2017-08-25',
    '2017-09-08',
    '2017-09-22',
    '2017-10-06',
    '2017-10-20',
    '2017-11-03',
    '2017-11-17',
    '2017-12-01',
    '2017-12-15',
    '2017-12-29',
    '2018-01-12',
    '2018-01-26',
    '2018-02-09',
    '2018-02-23',
    '2018-03-09',
    '2018-03-23',
    '2018-04-06',
    '2018-04-20',
    '2018-05-04',
    '2018-05-18',
    '2018-06-01',
    '2018-06-15',
    '2018-06-29',
    '2018-07-14',
    '2018-07-28',
    '2018-08-11',
    '2018-08-25',
    '2018-09-08',
    '2018-09-22',
    '2018-10-06',
    '2018-10-20',
    '2018-11-03',
    '2018-11-17',
    '2018-12-01',
    '2018-12-15',
    '2018-12-29',
    '2019-01-12',
    '2019-01-26',
    '2019-02-09',
    '2019-02-23',
    '2019-03-09',
    '2019-03-23',
    '2019-04-06',
    '2019-04-20',
    '2019-05-04',
    '2019-05-18',
    '2019-06-01',
    '2019-06-15',
    '2019-06-29',
    '2019-07-14',
    '2019-07-28',
    '2019-08-11',
    '2019-08-25',
    '2019-09-08',
    '2019-09-22',
    '2019-10-06',
    '2019-10-20',
    '2019-11-03',
    '2019-11-17',
    '2019-12-01',
    '2019-12-15',
    '2019-12-29',
    '2020-01-12',
    '2020-01-26',
    '2020-02-09',
    '2020-02-23',
    '2020-03-08',
    '2020-03-22',
    '2020-04-05',
    '2020-04-19',
    '2020-05-03',
    '2020-05-17',
    '2020-05-31',
    '2020-06-14',
    '2020-06-28',
    '2020-07-14',
    '2020-07-28',
    '2020-08-11',
    '2020-08-25',
    '2020-09-08',
    '2020-09-22',
    '2020-10-06',
    '2020-10-20',
    '2020-11-03',
    '2020-11-17',
    '2020-12-01',
    '2020-12-15',
    '2020-12-29',
    '2021-01-12',
    '2021-01-26',
    '2021-02-09',
    '2021-02-23',
    '2021-03-09',
    '2021-03-23',
    '2021-04-06',
    '2021-04-20',
    '2021-05-04',
    '2021-05-18',
    '2021-06-01',
    '2021-06-15',
    '2021-06-29',
    '2021-07-14',
    '2021-07-28',
    '2021-08-11',
    '2021-08-25',
    '2021-09-08',
    '2021-09-22',
    '2021-10-06',
    '2021-10-20',
    '2021-11-03',
    '2021-11-17',
    '2021-12-01',
    '2021-12-15',
    '2021-12-29',
    '2022-01-12',
    '2022-01-26',
    '2022-02-09',
    '2022-02-23',
    '2022-03-09',
    '2022-03-23',
    '2022-04-06',
    '2022-04-20',
    '2022-05-04',
    '2022-05-18',
    '2022-06-01',
    '2022-06-15',
    '2022-06-29',
    '2022-07-14',
    '2022-07-28',
    '2022-08-11',
    '2022-08-25',
    '2022-09-08',
    '2022-09-22',
    '2022-10-06',
    '2022-10-20',
    '2022-11-03',
    '2022-11-17',
    '2022-12-01',
    '2022-12-15',
    '2022-12-29',
    '2023-01-12',
    '2023-01-26',
    '2023-02-09',
    '2023-02-23',
    '2023-03-09',
    '2023-03-23',
    '2023-04-06',
    '2023-04-20',
    '2023-05-04',
    '2023-05-18',
    '2023-06-01',
    '2023-06-15',
    '2023-06-29'
    ]);
    
    var allImages = ee.List([]);
    
    /*Any featurecollection here*/
    var shape = /**/;
    
    var geometry = shape.geometry();
    
    var gayaDEM = srtm2.clip(geometry);
    
    // Calculating Slope
    var slope = ee.Terrain.slope(gayaDEM);
    
    var size = shape.size();
    var size1 = ee.Number(size).subtract(ee.Number(1));
    
    
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
    
    var mws = ee.List.sequence(0,size1);
    //***** LOOP *****//
    for(var k= 0;k<6;k++)
    {
      var sd = sy.get(k);
      var ed = ey.get(k);
      var lulc=ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1').filterDate(sd, ed);           
    
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
      for(var n = 0; n<26;n++)
      {
        var s = start_dates.get(n+(k*26));
        var e = end_dates.get(n+(k*26));
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
    
        }
        var ll = ee.List.sequence(0,14);
        var runoffs = ll.map(ant);
        runoffs=ee.ImageCollection(runoffs)
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
          
        
        allImages = allImages.add(total.clip(shape));
        
        var statsl = ee.List(stats2.toList(size));
        var l = ee.List([]); 
        var res = function(m){
          var f = ee.Feature(statsl.get(m));
          var id = f.get('Area');
          var feat = ee.Feature(shape.filter(ee.Filter.eq('Area', id)). first());
          var val = ee.Number(f.get('sum'));
          var a = ee.Number(feat.area());
          val = val.divide(a);
          return feat.set(s,val);
        };
        
        shape = ee.FeatureCollection(mws.map(res));
      }
    }
    
    
Export.table.toAsset({
    collection: shape,
    description:'Fortnight_Runoff',
    assetId: /*Asset ID of the asset to be exported*/
});
    
    
    