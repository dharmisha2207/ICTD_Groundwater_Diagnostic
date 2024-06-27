# Overview of the code available

## Hydrological Variables

The water balance equation uses the hydrological variables of Precipitation, Runoff and Evapotranspiration. the equation allows researchers to simplify and mathematically model Earth’s water cycle. Water balance equation will take precipitation (P), outgoing runoff (Qout) and evapotranspiration (ET) as inputs to output change in groundwater (∆G) as shown in the below equation.

![image](https://github.com/dharmisha2207/ICTD_Groundwater_Diagnostic/assets/45630336/ec3f9e57-7312-4915-85e4-0c7b7ff178f5)


Code for computation of datasets for each of these hydrological variables is available in their respective folders.

## Downscaling and calibration of ET

We thought of leveraging exisiting ET datasets to come up with an ET product at a much finer resolution. In our research, we use
the MODIS product. We aimed at generating ET rasters at a temporal resolution of 1-8
days and a spatial resolution of 30 metres and were successful in doing so.

Once ET at a finer resolution was predicted using machine learning based approaches
we found a need to calibrate it against the Indian Meteorological Department’s or IMD’s
data(ground truth). We also used climatic variables like, temperature, humidity, soil moisture, precipitation as input features when we generated models for calibration.

The model for ET downscaling(provided in this repository) was generated as follows:
1. In the ``Downscaling ET\GEE Scripts\Downscale_ET_TrainData.js`` file update the train_areas_aez_1to5 variable so that it contains the Earth Engine FeatureCollection ``Data\aez_train_areas.csv`` provided with this repository(You will need to first load the CSV onto Google Earth Engine to be able to import it for using it in the script.
2. Run the script and it will upload a CSV for each year and each season. These CSVs will have the data for all the training patches for different time periods.
3. Once the training data is exported, the ``Downscaling ET\Colab Scripts\modelTrain&Upload_ET.ipynb`` file will use the training data and train a model and upload the same on earth engine.
4. The same model can then be loaded on Earth Engine and the code in the ``Downscaling ET\GEE Scripts\Downscale_ET_Inference.js`` file can be used to make predictions for the downscaled data.
5. Sample models for the same have already been provided in the ``Data`` folder. ``Data\landsat_8_rf_model.csv`` is the earlier Random Forest model that was trained on Landsat 8 features. Similarly ``Data\updated_landsat_7_rf_model.csv`` is the 

Once the Downscaled ET is generated, we can move ahead and try calibrating it to the different regions of India as follows:
1. Load the ``Calibrating ET\Colab Scripts\K_Fold_Regression_Github.ipynb`` file on google colab.
2. Upload the ``Calibrating ET\Colab Scripts\ET_Version_2.xlsx`` file on colab and run different cells for different types of regression models to get different graphs and visualizations of how different models fare against each other.
