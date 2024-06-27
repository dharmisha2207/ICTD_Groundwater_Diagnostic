# Overview of the code available

## Hydrological Variables

The water balance equation uses the hydrological variables of Precipitation, Runoff and Evapotranspiration. the equation allows researchers to simplify and mathematically model Earth’s water cycle. Water balance equation will take precipitation (P), outgoing runoff (Qout) and evapotranspiration (ET) as inputs to output change in groundwater (∆G) as shown in the below equation.

![image](https://github.com/siddharths00/Groundwater_Diagnostics/assets/45630336/0a999359-3f91-4cad-8d9c-93174f2879b7)

Code for computation of datasets for each of these hydrological variables is available in their respective folders.

## Downscaling and calibration of ET

We thought of leveraging exisiting ET datasets to come up with an ET product at a much finer resolution. In our research, we use
the MODIS product. We aimed at generating ET rasters at a temporal resolution of 1-8
days and a spatial resolution of 30 metres and were successful in doing so.

Once ET at a finer resolution was predicted using machine learning based approaches
we found a need to calibrate it against the Indian Meteorological Department’s or IMD’s
data(ground truth). We also used climatic variables like, temperature, humidity, soil moisture, precipitation as input features when we generated models for calibration.

The model for ET downscaling(provided in this repository) was generated as follows:
1. In the ``Downscaling ET\GEE Scripts\Downscale_ET_TrainData.js`` file update the train_areas_aez_1to5 variable so that it contains an Earth Engine FeatureCollection provided with this repository.
2. XXX - Write about the year and season variables here.
3. Once the training data is exported, the ``Downscaling ET\Colab Scripts\modelTrain&Upload_ET.ipynb`` file will use the training data and train a model and upload the same on earth engine.
4. The same model can then be loaded on Earth Engine and the code in the ``Downscaling ET\GEE Scripts\Downscale_ET_Inference.js`` file can be used to make predictions for the downscaled data.

Once the Downscaled ET is generated, we can move ahead and try calibrating it to the different regions of India as follows:
1. Load the ``Calibrating ET\Colab Scripts\K_Fold_Regression_Github.ipynb`` file on google colab.
2. Upload the ``Calibrating ET\Colab Scripts\ET_Version_2.xlsx`` file on colab and run different cells for different types of regression models to get different graphs and visualizations of how different models fare against each other.
