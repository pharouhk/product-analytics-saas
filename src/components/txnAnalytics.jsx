import {useEffect, useState } from 'react';
import CreateChart from './Charts.jsx';
import { useAuth } from "../hooks/useAuth";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import  FileSaver  from 'file-saver';


function formatNumber(number) {
    const options = {
      notation: 'compact',
      compactDisplay: 'short'
    };

    return number.toLocaleString('en-US', options);
  }

function generateChart(data, data_name , chart_type){
  
    var data_config = [];

    if (data_name === "txnFailRate") {
        let valz = data[1]["fail_rate"];;
        data_config = [{
        values: valz["Count"],
        labels: valz["Category"],
        hole: .9,
        type: chart_type,
        marker: {
            colors: ["#D9D9D9", "#DE0005"]
            },
        textinfo: "none",
        automargin: true
        }];
    } else if (data_name === "txnPendRate") {
        let valz = data[1]["pend_rate"];;
        data_config = [{
            values: valz["Count"],
            labels: valz["Category"],
        hole: .9,
        type: chart_type,
        marker: {
            colors: ["#D9D9D9", "#BF9000"]
            },
        textinfo: "none",
        automargin: true
        }];
    } else if (data_name === "txnSuccRate") {
        let valz = data[1]["succ_rate"];
        data_config = [{
            values: valz["Count"],
            labels: valz["Category"],
            hole: .9,
            type: chart_type,
            marker: {
            colors: ["#00B050", "#D9D9D9"]
            },
            textinfo: "none",
            automargin: true
        }];
    } else if (data_name === "CRR") {
        let valz = {
            "Retention":17,
            "Inactive":83
        };
        data_config = [{
            //values: [28, 7],
            values: [valz["Retention"], valz["Inactive"] ],
            labels: ["Retention", "Inactive"],
            hole: .8,
            type: chart_type,
            marker: {
            colors: ["#FFC000", "#D9D9D9"]
            },
            textinfo: "none",
            automargin: true
        }];

    } else if (data_name === "CAR") {
        let valz = {
            "Onboarded":67,
            "Pending":23
        };
        data_config = [{
            //values: [28, 7],
            values: [valz["Onboarded"], valz["Pending"] ],
            labels: ["Onboarded", "Pending"],
            hole: .8,
            type: chart_type,
            marker: {
            colors: ["#68D78D", "#D9D9D9"]
            },
            textinfo: "none",
            automargin: true
        }];

    } else if (data_name === "revTrend") {
        let period_array = ["Jan", "Feb", "Mar", "Apr", "May"];
        let rev_array = [2341, 1873, 998, 1125, 938];
        data_config = [{
            x: period_array,
            y: rev_array,
            fill: 'tozeroy',
            type: chart_type,
            fillcolor: "#D2C1F1",
            mode: 'none',
            // text: rev_array.map(String),
            // textposition: 'auto',
            // automargin: true
        }];

    } else if (data_name === "volTrend" || data_name === "valTrend") {
    let count_array = data_name === 'volTrend'? data[2]["vol_trend"]["Count"]: data[2]["val_trend"]["Value"];
    let period_array = data_name === 'volTrend'? data[2]["vol_trend"]["Periods"]: data[2]["val_trend"]["Periods"];
    // let count_array = ["1*","60*","50*","3.5K", "1.2K", "2.0K", "4.5K", "6.7K"]
    data_config = [{
        x: period_array,
        y: count_array,
        type: chart_type,
        marker: {
            color:"#DAE3F3"
        },
        text: count_array.map(formatNumber),
        textposition: 'auto',
        automargin: true
    }];

}

return data_config;

}



function txnAnalytics() {
  const data_refresh = 3600000//milliseconds == 1 hour
  
  let dynamicDate = new Date;
  dynamicDate.setHours(0,0,0,0); 
  dynamicDate.setDate(dynamicDate.getDate() - 1); 
  let yesterday = new Date(dynamicDate);
  dynamicDate.setDate(dynamicDate.getDate() - 365);
  let oneYearAgo = new Date(dynamicDate);
  const FormatDateFn = (date) => {
    const selectedDate = new Date(date);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  };
  const minDate = FormatDateFn(yesterday);
  const maxDate = FormatDateFn(oneYearAgo);
  const freq = 'Hourly';

  const { user } = useAuth();

  const options = ["Volume", "Value", "Pending", "Failed"];

//   const prefixes = ["835", "836", "835", "919", "903"];
//   const nuban = ["0043835", "121836", "0121835", "0934919", "0053903"];
  
  const [prefix, setPrefix] = useState("All"); 
  const [customer, setCustomer] = useState("All");
  const [sorting, setSorting] = useState("Volume");
  const [startDate, setstartDate] = useState(FormatDateFn(new Date()));
  const [endDate, setendDate] = useState(FormatDateFn(new Date()));

  const [error, setError] = useState(null);
  const [isLoadingAll, setIsLoadingAll] = useState(true); // this state is for first time page load
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [pageData, setPageData] = useState([]);
  const [activeTab1, setActiveTab1] = useState('volume');
  const [activeTab2, setActiveTab2] = useState('volume');
  

  const handleChangeDateStart = (date) => {
    setstartDate(FormatDateFn(date));
  };

  const handleChangeDateEnd = (date) => {
    setendDate(FormatDateFn(date));
  };

  function jsonToCsv(jsonObject) {
    // Get all keys from the first object (assuming consistent structure)
    const keys = Object.keys(jsonObject);
    const numRows = jsonObject[keys[0]].length;
  
    // Build the CSV header row
    let csvContent = keys.join(",");
  
    // Loop through each object in the JSON array
    for (let i=0; i<numRows; i++) {
      // Get the values for each key
      let values = new Array();
      for (const key in jsonObject) {
         values.push(jsonObject[key][i]);
      }
  
      // Add a new row with comma-separated values
      csvContent += "\n" + values.join(",");
    }
  
    return csvContent;
  }

  function handleExport() {
    const cust_data = pageData[3]["topCust"];
    const csv = jsonToCsv(cust_data)
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvData, 'Top_customers.csv');
  }


  const getData = async (url="http://127.0.0.1:1030/embedly/prefix/"+prefix+"/customer/"+customer+"/startDate/"+startDate+"/endDate/"+endDate+"?sort_how="+sorting+"&?user="+user.email) => {
      
      setIsLoadingAll(true);

      await fetch(url)
        .then(res => res.json())
        .then(
          (result) => {
            setPageData(result);
            setIsLoadingAll(false);
            setIsLoadingTable(false);
          },
         
          (error) => {
            setError(error);
            setIsLoadingAll(false);
            setIsLoadingTable(false);
        }
      )
    };

 const updateTableData = async (url="http://127.0.0.1:1030/embedly/prefix/"+prefix+"/customer/"+customer+"/startDate/"+startDate+"/endDate/"+endDate+"?sort_how="+sorting+"&?user="+user.email) => {
      
    setIsLoadingTable(true);

    await fetch(url)
    .then(res => res.json())
    .then(
        (result) => {
        setPageData(result);
        setIsLoadingTable(false);
        },
        
        (error) => {
        setError(error);
        setIsLoadingTable(false);
    }
    )
    };

  useEffect(() =>
    {
    //  if (endDate !== '1970-01-01'){
        
        getData();
        const interval = setInterval(getData, data_refresh);
        return () => clearInterval(interval);
    // }

  }, 
  [prefix, customer, endDate]);

  useEffect(() =>
    {
        updateTableData();
  }, 
  [sorting]);

  if (error) {
    return (
        <>
        <nav class="navbar navbar-expand-lg" id="nav-bg-color">
            <div class="container-fluid">
            <a class="navbar-brand" href="#"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" id = "inactive-nav" aria-current="page" href="/overview">Analytics</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id = "active-nav" aria-disabled="true" href="#">Transactions</a>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        <div className='containerCustomTransaction'>
            <div className='errorPage'>
                <div className='errorDiv'>
                    {/* <div class="max-w-md"> */}
                        <div className= 'errorLabel'>Error:</div>
                        <p className='errorMsg'>
                            {error.message}
                        </p>
                        <p className='userInstruction'>Please Refresh the Page. It is likely that your internet connection was lost or your Microsoft AD session needs to be refreshed.</p>
                    {/* </div> */}
                    
                </div>
            </div>
        </div>
    </>


    )
  } 
  else if (isLoadingAll) {
    // console.log(isLoading);// should print true
    return (
        <>
        <nav class="navbar navbar-expand-lg" id="nav-bg-color">
            <div class="container-fluid">
            <a class="navbar-brand" href="#"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" id = "inactive-nav" aria-current="page" href="/overview">Analytics</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id = "active-nav" aria-disabled="true" href="#">Transactions</a>
                </li>
                </ul>
            </div>
            </div>
        </nav>
        <div className='containerCustomTransaction'>
          
        <div className='nameAndFilterRow'>
          <div id='positionNameAndFilters'>
            <h6 id="PageName">
              Transaction Analytics
            </h6>
            <div className="FilterRowTxns">
              <div className="fspDropDown">
                <span>Customer Name:</span>
                <select class='optionsClass'>
                  <option value={customer}>{customer}</option>
                </select>
              </div>
              <div className="prefixDropDown">
                <span>Prefix:</span>
                <select class='optionsClass'>
                  <option value={prefix}>{prefix}</option>
                </select>
              </div>
              <div className="dateRangeField">
                <label className='dateLabel'>Date: </label>
                  <span className='startDate'>
                    <DatePicker 
                    showIcon
                    selected = {startDate}
                    />
                  </span>
                  <span className='endDate'>
                    <DatePicker 
                    showIcon
                    selected = {endDate}/>
                  </span>
              </div>
            </div>
          </div>
        </div>

        <div className='volvalCard'>
          <div className='tabCards'>
              <div className='volval-nav-tabs'>
                  <a href='#' id="volume" className={activeTab1==='volume'? 'nav-activeTab': 'nav-inactiveTab'}
                  onClick={()=>setActiveTab1('volume')}>Volume</a>
                  <a href='#' id="value" className={activeTab1==='value'? 'nav-activeTab': 'nav-inactiveTab'}
                  onClick={()=>setActiveTab1('value')}>Value</a>
              </div>
              <div className='volval-tab-contents'>
                  <div className={activeTab1==='volume'? 'card active': 'card inactive'}>
                      <div class="card-body customized">
                          <div className='cardAggNum'>
                              <br></br>
                              <h1>
                                <Skeleton containerClassName="skeletonFlex" count={1} height={70}/>
                              </h1>
                              <span class="card-text">Total Notifications</span>
                          </div>
                          <div className='cardTxnRate'>
                              <Skeleton containerClassName="skeletonFlex" count={1} height={120}/>
                              <p className='rateLabel'>Notif. Delivery Rate</p>
                          </div>
                          <div className='cardTxnRate'>
                             <Skeleton containerClassName="skeletonFlex" count={1} height={120}/>
                              <p className='rateLabel'>Pending Delivery Rate</p>
                          </div>
                          <div className='cardTxnRate'>
                              <Skeleton containerClassName="skeletonFlex" count={1} height={120} />
                              <p className='rateLabel'>Failed Delivery Rate</p>
                          </div>
                      </div>
                  </div>
                  <div className={activeTab1==='value'? 'card active': 'card inactive'}>
                      <div class="card-body customized">
                          <div className='cardAggNum'>
                              <br></br>
                              <h1>
                                <Skeleton containerClassName="skeletonFlex" count={1} height={70}/>
                              </h1>
                              <span class="card-text">Total Value</span>
                          </div>
                          <div className='cardTxnRate'>
                             <Skeleton containerClassName="skeletonFlex" count={1} height={120} />
                              <p className='rateLabel'>Notif. Delivery Rate</p>
                          </div>
                          <div className='cardTxnRate'>
                             <Skeleton containerClassName="skeletonFlex" count={1} height={120} />
                              <p className='rateLabel'>Pending Delivery Rate</p>
                          </div>
                          <div className='cardTxnRate'>
                              <Skeleton containerClassName="skeletonFlex" count={1} height={120} />
                              <p className='rateLabel'>Failed Delivery Rate</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>

        <div className="volvalTrend">
          <div className='tabCards'>
              <div className='volval-nav-tabs'>
                  <a href='#' id="volume" className={activeTab2==='volume'? 'nav-activeTab': 'nav-inactiveTab'}
                  onClick={()=>setActiveTab2('volume')}>Volume</a>
                  <a href='#' id="value" className={activeTab2==='value'? 'nav-activeTab': 'nav-inactiveTab'}
                  onClick={()=>setActiveTab2('value')}>Value</a>
              </div>
              <div className='volval-tab-contents'>
                  <div className={activeTab2==='volume'? 'card active': 'card inactive'}>
                      <div className='headerRow'>
                          <h7 class="card-header bg-transparent">Volume Trend {"(" + freq + ")"}</h7>
                          {/* <p>
                              <span id="freqSpan">Frequency:</span>
                              <select class='optionsPeriodClass'>
                                  <option value='Hourly'>Hourly</option>
                                  <option value='Daily'>Daily</option>
                                  <option value='Monthly'>Monthly</option>
                              </select>
                          </p> */}
                      </div>
                      <div className="cardBarTrends">
                        <Skeleton containerClassName="skeletonFlex" count={1} height={120} width={"98%"} />
                      </div>
                  </div>
                  <div className={activeTab2==='value'? 'card active': 'card inactive'}>
                      <div className='headerRow'>
                          <h7 class="card-header bg-transparent">Value Trend {"(" + freq + ")"}</h7>
                          {/* <p>
                              <span id="freqSpan">Frequency:</span>
                              <select class='optionsPeriodClass'>
                                  <option value='Hourly'>Hourly</option>
                                  <option value='Daily'>Daily</option>
                                  <option value='Monthly'>Monthly</option>
                              </select>
                          </p> */}
                      </div>
                      <div className="cardBarTrends">
                        <Skeleton containerClassName="skeletonFlex" count={1} height={120} width={"98%"} />
                      </div>
                  </div>
              </div>
          </div>
        </div>
        
        <div className='fspTable'>
          <div className='card fspTableContents'>
              <div className='tableHeaderRow'>
                  <p id="sortBy">
                      <span>Sort by:</span>
                      <select class='optionsTableClass'>
                        <option value={sorting}>{sorting}</option>
                            {options.filter((opt)=>{return opt !=sorting}).map((eachOption, index) =>{
                                return (
                                    <option value={eachOption}>{eachOption}</option>
                                )
                                })
                                
                                }
                      </select>
                  </p>
                  {/* <p id="showAs">
                      <span>Show as:</span>
                      <select class='optionsTableClass'>
                        <option value='Count'>Count</option>
                        <option value='% Total'>% Total</option>
                      </select>
                  </p> */}
              </div>
              <div className='tableData'>
                <div className="eachDataRow">
                    <p className='topRowLoader'> <Skeleton containerClassName="skeletonFlex"  count={1}/> </p>
                    <p className='topRowLoader' ><Skeleton containerClassName="skeletonFlex" count={1} /> </p>
                    <div className='eachBottomRow'>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader' >
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                    </div>  
                </div>
                <div className="eachDataRow">
                    <p className='topRowLoader'> <Skeleton containerClassName="skeletonFlex"  count={1}/> </p>
                    <p className='topRowLoader' ><Skeleton containerClassName="skeletonFlex" count={1} /> </p>
                    <div className='eachBottomRow'>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader' >
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                        <p className='textAndBgLoader'>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                        </p>
                    </div>  
                </div>
              </div>
              <div className='exportButtonDiv'>
                  <p></p>
                  <button id="exportButton" type="button" class="btn btn-primary ">Export Data</button>
              </div>
          </div>
        </div>
      </div>
      </>
      );
  } 
  else {
  return (
    <div>
        <nav class="navbar navbar-expand-lg" id="nav-bg-color">
          <div class="container-fluid">
            <a class="navbar-brand" href="#"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" id = "inactive-nav" aria-current="page" href="/overview">Analytics</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id = "active-nav" aria-disabled="true" href="#">Transactions</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='containerCustomTransaction'>
          
          <div className='nameAndFilterRow'>
            <div id='positionNameAndFilters'>
              <h6 id="PageName">
                Transaction Analytics
              </h6>
              <div className="FilterRowTxns">
                <div className="fspDropDown">
                  <span>Customer Name:</span>
                  <select className='optionsClass' onChange={(e)=>setCustomer(e.target.value)}>
                    <option value={customer}>{customer}</option>
                    {pageData[0]['overall']['All customers'].map((eachCustomer, index) =>{
                        return (
                            <option value={eachCustomer}>{eachCustomer}</option>
                        )
                        })
                        
                        }
                  </select>
                </div>
                <div className="prefixDropDown">
                  <span>Prefix:</span>
                  <select className='optionsClass' onChange={(e)=>setPrefix(e.target.value)}>
                    <option value={prefix}>{prefix}</option>
                    {pageData[0]['overall']['All prefixes'].map((eachPrefix, index) =>{
                    return (
                        <option value={eachPrefix}>{eachPrefix}</option>
                    )
                    })
                    
                    }
                  </select>
                </div>
                <div className="dateRangeField">
                  <label className='dateLabel'>Date: </label>
                    <span className="startDate">
                      <DatePicker 
                        showIcon
                        selected={startDate}
                        onChange={handleChangeDateStart}
                        minDate={oneYearAgo}
                        maxDate={yesterday}
                        startDate={startDate}
                        // endDate={endDate}
                        // shouldCloseOnSelect={!endDate}
                      />
                    </span>
                    <span className='endDate'>
                      <DatePicker 
                        showIcon
                        selected={endDate}
                        onChange={handleChangeDateEnd}
                        minDate={startDate}
                        maxDate={yesterday}
                        // startDate={startDate}
                        endDate={endDate}
                        // shouldCloseOnSelect={!endDate}
                      />
                    </span>
                </div>
              </div>
            </div>
          </div>

          <div className='volvalCard'>
            <div className='tabCards'>
                <div className='volval-nav-tabs'>
                    <a href='#' id="volume" className={activeTab1==='volume'? 'nav-activeTab': 'nav-inactiveTab'}
                    onClick={()=>setActiveTab1('volume')}>Volume</a>
                    <a href='#' id="value" className={activeTab1==='value'? 'nav-activeTab': 'nav-inactiveTab'}
                    onClick={()=>setActiveTab1('value')}>Value</a>
                </div>
                <div className='volval-tab-contents'>
                    <div className={activeTab1==='volume'? 'card active': 'card inactive'}>
                        <div class="card-body customized">
                            {/* {isLoading? (<Skeleton containerClassName="skeletonFlex" count={6} />) :
                            (
                            <> */}
                            <div className='cardAggNum'>
                                <br></br>
                                <h3 class="card-title">{(pageData[0]["overall"]["Total Notifications"]).toLocaleString()}</h3>
                                <span class="card-text">Total Notifications</span>
                            </div>
                            <div className='cardTxnRate'>
                                <CreateChart
                                    name="txnSuccRate"
                                    contentData = {generateChart(pageData, "txnSuccRate", "pie")}
                                    displayRateText = {
                                        parseFloat((pageData[1]["succ_rate"].Count[0]/pageData[0]["overall"]["Total Notifications"]) * 100).toFixed(0) + "%"
                                    }
                                />
                                <p className='rateLabel'>Notif. Delivery Rate</p>
                            </div>
                            <div className='cardTxnRate'>
                                <CreateChart
                                    name="txnPendRate"
                                    contentData = {generateChart(pageData, "txnPendRate", "pie")}
                                    displayRateText = {
                                        parseFloat((pageData[1]["pend_rate"].Count[1]/pageData[0]["overall"]["Total Notifications"]) * 100).toFixed(0) + "%"
                                    }
                                />
                                <p className='rateLabel'>Pending Delivery Rate</p>
                            </div>
                            <div className='cardTxnRate'>
                                <CreateChart
                                    name="txnFailRate"
                                    contentData = {generateChart(pageData, "txnFailRate", "pie")}
                                    displayRateText = {
                                        parseFloat((pageData[1]["fail_rate"].Count[1]/pageData[0]["overall"]["Total Notifications"]) * 100).toFixed(0) + "%"
                                    }
                                />
                                <p className='rateLabel'>Failed Delivery Rate</p>
                            </div>
                        </div>
                    </div>
                    <div className={activeTab1==='value'? 'card active': 'card inactive'}>
                        <div class="card-body customized">
                            <div className='cardAggNum'>
                                <br></br>
                                <h3 class="card-title">{"NGN " + formatNumber(pageData[0]["overall"]["Total Amount"])}</h3>
                                <span class="card-text">Total Value</span>
                            </div>
                            <div className='cardTxnRate'>
                                <CreateChart
                                    name="txnSuccRate"
                                    contentData = {generateChart(pageData, "txnSuccRate", "pie")}
                                    displayRateText = {
                                        parseFloat((pageData[1]["succ_rate"].Count[0]/pageData[0]["overall"]["Total Notifications"]) * 100).toFixed(0) + "%"
                                    }
                                />
                                <p className='rateLabel'>Notif. Delivery Rate</p>
                            </div>
                            <div className='cardTxnRate'>
                                <CreateChart
                                    name="txnPendRate"
                                    contentData = {generateChart(pageData, "txnPendRate", "pie")}
                                    displayRateText = {
                                        parseFloat((pageData[1]["pend_rate"].Count[1]/pageData[0]["overall"]["Total Notifications"]) * 100).toFixed(0) + "%"
                                    }
                                />
                                <p className='rateLabel'>Pending Delivery Rate</p>
                            </div>
                            <div className='cardTxnRate'>
                                <CreateChart
                                    name="txnFailRate"
                                    contentData = {generateChart(pageData, "txnFailRate", "pie")}
                                    displayRateText = {
                                        parseFloat((pageData[1]["fail_rate"].Count[1]/pageData[0]["overall"]["Total Notifications"]) * 100).toFixed(0) + "%"
                                    }
                                />
                                <p className='rateLabel'>Failed Delivery Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="volvalTrend">
            <div className='tabCards'>
                <div className='volval-nav-tabs'>
                    <a href='#' id="volume" className={activeTab2==='volume'? 'nav-activeTab': 'nav-inactiveTab'}
                    onClick={()=>setActiveTab2('volume')}>Volume</a>
                    <a href='#' id="value" className={activeTab2==='value'? 'nav-activeTab': 'nav-inactiveTab'}
                    onClick={()=>setActiveTab2('value')}>Value</a>
                </div>
                <div className='volval-tab-contents'>
                    <div className={activeTab2==='volume'? 'card active': 'card inactive'}>
                        <div className='headerRow'>
                            <h7 class="card-header bg-transparent">Volume Trend { "(" + pageData[0]['overall']['Frequency'] + ")"}</h7>
                            {/* <p>
                                <span id="freqSpan">Frequency: {freq}</span>
                                <select class='optionsPeriodClass'>
                                    <option value={freq}>{freq}</option>
                                </select>
                            </p> */}
                        </div>
                        <div className="cardBarTrends">
                            {/* {isLoadingTrend? (<Skeleton containerClassName="skeletonFlex" count={1} height={120} width={"98%"} />) :
                            (
                            <> */}
                                <CreateChart
                                    name = "volTrend"
                                    contentData = {generateChart(pageData, "volTrend", "bar")}
                                />
                            {/* </>
                            )
                            } */}
                        </div>
                    </div>
                    <div className={activeTab2==='value'? 'card active': 'card inactive'}>
                        <div className='headerRow'>
                            <h7 class="card-header bg-transparent">Value Trend { "(" + pageData[0]['overall']['Frequency'] + ")"}</h7>
                            {/* <p>
                                <span id="freqSpan">Frequency:</span>
                                <select class='optionsPeriodClass'>
                                    <option value={freq}>{freq}</option>
                                </select>
                            </p> */}
                        </div>
                        <div className="cardBarTrends">
                            {/* {isLoadingTrend? (<Skeleton containerClassName="skeletonFlex" count={1} height={120} width={"98%"} />) :
                            (
                            <> */}
                                <CreateChart
                                    name = "valTrend"
                                    contentData = {generateChart(pageData, "valTrend", "bar")}
                                />
                            {/* </>
                            )
                            } */}
                        </div>
                    </div>
                </div>
            </div>
          </div>
          
          <div className='fspTable'>
            <div className='card fspTableContents'>
                <div className='tableHeaderRow'>
                    <p id="sortBy">
                        <span>Sort by:</span>
                        <select value={sorting} class='optionsTableClass' onChange={(e)=>{setSorting(e.target.value)}}>
                            <option value={sorting}>{sorting}</option>
                                {options.filter((opt)=>{return opt !=sorting}).map((eachOption, index) =>{
                                    return (
                                        <option value={eachOption}>{eachOption}</option>
                                    )
                                    })
                                    
                                    }
                        </select>
                    </p>
                    {/* <p id="showAs">
                        <span>Show as:</span>
                        <select class='optionsTableClass'>
                            <option value='Count'>Count</option>
                            <option value='% Total'>% Total</option>
                        </select>
                    </p> */}
                </div>
                <div className='tableData'>
                    {isLoadingTable? 
                        <div className="eachDataRow">
                            <p className='topRowLoader'> <Skeleton containerClassName="skeletonFlex"  count={1}/> </p>
                            <p className='topRowLoader' ><Skeleton containerClassName="skeletonFlex" count={1} /> </p>
                            <div className='eachBottomRow'>
                                <p className='textAndBgLoader'>
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                                <p className='textAndBgLoader'>
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                                <p className='textAndBgLoader' >
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                                <p className='textAndBgLoader'>
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                                <p className='textAndBgLoader'>
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                                <p className='textAndBgLoader'>
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                                <p className='textAndBgLoader'>
                                    <Skeleton containerClassName="skeletonFlex" count={1} />
                                </p>
                            </div>  
                        </div>:
                    
                        pageData[3]["topCust"]["AccountNo"].map((eachAcct, index) =>{
                            return (
                                <div className="eachDataRow">
                                    <p className='eachTopRow'>Account No: {eachAcct} | Prefix: {pageData[3]["topCust"]["Prefix"][index]} </p>
                                    <p className='eachMiddleRow' >Customer Name: {pageData[3]["topCust"]["Customer Name"][index]} </p>
                                    <div className='eachBottomRow'>
                                        <p className='textandBgRev'>
                                            <span>Revenue:</span>
                                            <span className='textBold'> {"N/A"}</span> 
                                        </p>
                                        <p className='textandBgCnt'>
                                            <span>Txn. Count:</span>
                                            <span className='textBold'> {(pageData[3]["topCust"]["Count"][index]).toLocaleString()} </span>
                                        </p>
                                        <p className='textandBgVal' >
                                            <span>Txn. Value:</span>
                                            <span className='textBold'> {"N"+(pageData[3]["topCust"]["Value"][index]).toLocaleString()}</span>
                                        </p>
                                        <p>
                                            <span>Pending Notif:</span> 
                                            <span className='textPend'> {(pageData[3]["topCust"]["Pending"][index]).toLocaleString()} </span>
                                        </p>
                                        <p>
                                            <span>Failed Notif:</span> 
                                            <span className='textFail'> {(pageData[3]["topCust"]["Failed delivery"][index]).toLocaleString()} </span>
                                        </p>
                                        <p>
                                            <span>Failed Txns:</span> 
                                            <span className='textFail'> {(pageData[3]["topCust"]["Failed"][index]).toLocaleString()} </span>
                                        </p>
                                        <p>
                                            <span>Top Failure Reason:</span> 
                                            <span className='textFail'> {pageData[3]["topCust"]["top_fail_reason"][index]} </span>
                                        </p>
                                    </div>  
                                </div>
                                );
                    })}
                </div>
                <div className='exportButtonDiv'>
                    <p></p>
                    <button onClick={handleExport} id="exportButton" type="button" class="btn btn-primary ">Export Data</button>
                </div>
            </div>
          </div>
            
        
        
        
        
        
        </div>
    </div>
  );
}

}

export default txnAnalytics;