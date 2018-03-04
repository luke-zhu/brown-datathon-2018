from tkinter import *
# Import the required packages
import pandas as pd
import numpy as np
from pymongo import MongoClient

import matplotlib
matplotlib.use('TkAgg')
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.pyplot as plt

import numpy as np
import scipy.stats as stats
import statsmodels.api as sm
import pandas as pd
import csv


def calculate_test_statistic(ts):
    """Calculate the test statistic defined by being
       the top zscore in the timeseries.
    Args:
        ts (list or np.array): The timeseries to compute the test statistic.
    Returns:
        tuple(int, float): The index of the top zscore and the value of the top zscore.
    """
    zscores = abs(stats.zscore(ts, ddof=1))
    max_idx = np.argmax(zscores)
    return max_idx, zscores[max_idx]


def calculate_critical_value(ts, alpha):
    """Calculate the critical value with the formula given for example in
    https://en.wikipedia.org/wiki/Grubbs%27_test_for_outliers#Definition
    Args:
        ts (list or np.array): The timeseries to compute the critical value.
        alpha (float): The significance level.
    Returns:
        float: The critical value for this test.
    """
    size = len(ts)
    t_dist = stats.t.ppf(1 - alpha / (2 * size), size - 2)

    numerator = (size - 1) * t_dist
    denominator = np.sqrt(size ** 2 - size * 2 + size * t_dist ** 2)

    return numerator / denominator


def seasonal_esd(ts, seasonality=None, hybrid=False, max_anomalies=10, alpha=0.05):
    """Compute the Seasonal Extreme Studentized Deviate of a time series.
       The steps taken are first to to decompose the timeseries into STL
       decomposition (trend, seasonality, residual). Then, calculate
       the Median Absolute Deviate (MAD) if hybrid (otherwise the median)
       and perform a regular ESD test on the residual, which we calculate as:
                        R = ts - seasonality - MAD or median

       Note: The statsmodel library requires a seasonality to compute the STL
       decomposition, hence the parameter seasonality. If none is given,
       then it will automatically be calculated to be 20% of the total
       timeseries.
    Args:
        ts (list or np.array): The timeseries to compute the ESD.
        seasonality (int): Number of time points for a season.
        hybrid (bool): See Twitter's research paper for difference.
        max_anomalies (int): The number of times the Grubbs' Test will be applied to the ts.
        alpha (float): The significance level.
    Returns:
        list int: The indices of the anomalies in the timeseries.
    """
    ts = np.array(ts)
    seasonal = seasonality or int(0.2 * len(ts))  # Seasonality is 20% of the ts if not given.
    decomp = sm.tsa.seasonal_decompose(ts, freq=seasonal)
    if hybrid:
        mad = np.median(np.abs(ts - np.median(ts)))
        residual = ts - decomp.seasonal - mad
    else:
        residual = ts - decomp.seasonal - np.median(ts)
    outliers = esd(residual, max_anomalies=max_anomalies, alpha=alpha)
    return outliers


def esd(timeseries, max_anomalies=10, alpha=0.05):
    """Compute the Extreme Studentized Deviate of a time series.
       A Grubbs Test is performed max_anomalies times with the caveat
       that each time the top value is removed. For more details visit
       http://www.itl.nist.gov/div898/handbook/eda/section3/eda35h3.htm
    Args:
        timeseries (list or np.array): The timeseries to compute the ESD.
        max_anomalies (int): The number of times the Grubbs' Test will be applied to the ts.
        alpha (float): The significance level.
    Returns:
        list int: The indices of the anomalies in the timeseries.
    """
    ts = np.copy(np.array(timeseries))
    test_statistics = []
    total_anomalies = -1
    for curr in range(max_anomalies):
        test_idx, test_val = calculate_test_statistic(ts)
        critical_value = calculate_critical_value(ts, alpha)
        if test_val > critical_value:
            total_anomalies = curr
        test_statistics.append(test_idx)
        ts = np.delete(ts, test_idx)
    anomalous_indices = test_statistics[:total_anomalies + 1]
    return anomalous_indices

sales = [367.0, 215.0, 350.5, 387.0, 927.5, 707.0, 802.5, 250.0, 237.63999999999999, 334.5, 327.0, 273.5,
             828.04999999999995, 598.0, 484.0, 247.5, 274.0, 380.5, 481.5, 722.5, 884.0, 418.0, 392.0, 143.5, 280.0,
             161.0, 263.0, 548.5, 557.5, 445.5]


def show_answer():
    """Receives culture rating, city, and state inputs. Gather commute, crime, rainfall, and snowfall data for these inputs.
    Returns recommendations one whether or not the employees are happy with the job in term of recommendations. It also outputs
    probability of "yes" and "no".
    """

    #Extract city and state input
    x = num1.get()

    # initiate plot
    fig = plt.figure(1)
    plt.ion()
    plt.gcf().clear()

    sales = [215.0, 350.5, 387.0, 927.5, 707.0, 802.5, 250.0, 237.63999999999999, 334.5, 327.0, 273.5,
             828.04999999999995, 598.0, 484.0, 247.5, 274.0, 380.5, 481.5, 722.5, 884.0, 418.0, 392.0, 143.5, 280.0,
             161.0, 263.0, 548.5, 557.5, 445.5]

    blank.delete(0, END)# clear previous input values

    try:
        sales.append(int(x))
    except:
        print('hello')
        blank.delete(0, END)
        blank.insert(0, "Please insert an numeric value")

    outliers_indices = seasonal_esd(sales, hybrid=True, max_anomalies=10)
    for idx in outliers_indices:
        print("Anomaly index: {0}, anomaly value: {1}".format(idx, sales[idx]))
    if 29 in outliers_indices:
        answer = 'Anomaly'
    else:
        answer = 'Not Anomaly'

    blank.insert(0, answer)
    try:
        a = int(x)
    except:
        print('hello')
        blank.delete(0, END)
        blank.insert(0, "Please insert an numeric value")



    answer = '' #output answer

    #generate probability chart
    plt.plot(sales)
    plt.ylabel('sales')
    canvas = FigureCanvasTkAgg(fig, main)
    plot_widget = canvas.get_tk_widget()
    plot_widget.grid(row=5, columnspan=2)

#initiation UI
main = Tk()


#Text boxes
num1 = Entry(main,width=30)
num1.insert(END, 'Today Revenue')
Label(main, text = "Result").grid(row=3,sticky='e')


#Insert text box
num1.grid(row=0, column=1)
blank = Entry(main,width=30)
blank.grid(row=3, column=1)

#Buttons for quit and run
Button(main, text='Quit', command=main.destroy).grid(row=4, column=0, sticky=W, pady=4)
Button(main, text='Run', command=show_answer).grid(row=4, column=1, sticky=W, pady=4)

fig = plt.figure(1)
plt.ion()
plt.gcf().clear()
plt.plot(sales)
plt.ylabel('sales')
canvas = FigureCanvasTkAgg(fig, main)
plot_widget = canvas.get_tk_widget()
plot_widget.grid(row=5, columnspan=2)

mainloop()