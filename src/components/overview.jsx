import {useEffect, useState } from 'react';
import CreateChart from './Charts.jsx';
import { useAuth } from "../hooks/useAuth";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const pageData = [
  {
      "overall":{
          "Total Count":12566778,
          "All products": ['TruDesk', "Druid", "Anthena", "Veem", "SwayPitch", "Seafire"]
      }
  },

  {
      "topCust":{
          "Customer Name":["Gabriel Afolayan", "Yemisi Riskat", "Josh dart", "Nurt west", "Renese bold", "Devon atemp", "Pulisic hardy", "Tom brady", "Alex Scott"],
          "email":["Gabriel.Afolayan@gmail.com", "Yemisi.Riskat@gmail.com", "Josh.dart@gmail.com", "Nurt.west@gmail.com", "Renese.bold@gmail.com", "Devon.atemp@gmail.com", "Pulisic.hardy@gmail.com", "Tom.brady@gmail.com", "Alex.Scott@gmail.com"],
          "Country":['Nigeria', "Nigeria", "US", "Canada", "Canada", "Belgium", "Switzerland", "US", "US"],
          "subscription":["$4,567", "$3,112", "$2,809", "$2,510", "$2,007", "$1,989", "$1,112", "$960", "$487"]
      }
  },

  {
      "inactive":{
        "Customer Name":["Fuli skweek", "Yomi atah", "Noh wey", "Sheldon wright", "Klaus dunk", "Emily kate", "Noah Prichard", "Assene stoke", "Phillip Puzzled"],
        "email":["Fuli.skweek@gmail.com", "Yomi.atah@gmail.com", "Noh.wey@gmail.com", "Sheldon.wright@gmail.com", "Klaus.dunk@gmail.com", "Emily.kate@gmail.com", "Noah.prichard@gmail.com", "Assene.stoke@gmail.com", "Phillip.puzzled@gmail.com"],
        "Country":['Nigeria', "Nigeria", "US", "Canada", "Canada", "Belgium", "Switzerland", "US", "US"],
        "Onboarding Date":["2024-05-10", "2023-11-12", "2023-08-09", "2022-08-10", "2023-11-12", "2024-02-09", "2024-05-10", "2023-11-12", "2023-08-09"]
      }
  }

];

function formatNumber(number) {
  const options = {
    notation: 'compact',
    compactDisplay: 'short'
  };

  return number.toLocaleString('en-US', options);
}

function generateChart(data_name , chart_type){
  
  var data_config = [];

  if (data_name === "CRR") {
      let valz = {
        "Retention":0.24,
        "Inactive":0.76
      };
      data_config = [{
        //values: [28, 7],
        values: [valz["Retention"], valz["Inactive"]],
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
        "Onboarded":0.31,
        "Pending":0.69
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
      let period_array = ["Jan-2024", "Feb-2024", "Mar-2024", "Apr-2024", "May-2024", "Jun-2024", "Jul-2024"];
      let rev_array = [64561, 78912, 77652, 88946, 91162, 89018, 97009];
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

}
return data_config;

}



function Overview() {
  const data_refresh = 3600000//milliseconds == 1 hour

  let dynamicDate = new Date;
  dynamicDate.setHours(0,0,0,0); 
  dynamicDate.setDate(dynamicDate.getDate() - 1); 
  let yesterday = new Date(dynamicDate);
  
  dynamicDate.setDate(dynamicDate.getDate() - 360);
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
  

  const prefixesLoader = [1, 2, 3, 4, 5, 6];
  
  const [error, setError] = useState(null);
  const [isLoadingAll, setIsLoadingAll] = useState(false); // this state is for first time page load
  const [customer, setCustomer] = useState("All");
  const [startDate, setstartDate] = useState(FormatDateFn(new Date()));
  const [endDate, setendDate] = useState(FormatDateFn(new Date()));

  
  // const [pageData, setPageData] = useState([]);
  const [activeTab, setActiveTab] = useState('top-used');

  const handleChangeDateStart = (date) => {
    setstartDate(FormatDateFn(date));
  };

  const handleChangeDateEnd = (date) => {
    setendDate(FormatDateFn(date));
  };

//   const getData = () => {

//     let result = [
//       {
//           "overall":{
//               "Total Count":12566778,
//               "All products": ['Sweep', "Druid", "Anthena", "Veem", "SwayPitch", "Seafire"]
//           }
//       },

//       {
//           "topCust":{
//               "Customer Name":["Gabriel Afolayan", "Yemisi Riskat", "Josh dart", "Nurt west", "Renese bold", "Devon atemp", "Pulisic hardy", "Tom brady", "Alex Scott"],
//               "email":["Gabriel.Afolayan@gmail.com", "Yemisi.Riskat@gmail.com", "Josh.dart@gmail.com", "Nurt.west@gmail.com", "Renese.bold@gmail.com", "Devon.atemp@gmail.com", "Pulisic.hardy@gmail.com", "Tom.brady@gmail.com", "Alex.Scott@gmail.com"],
//               "Country":['Nigeria', "Nigeria", "US", "Canada", "Canada", "Belgium", "Switzerland", "US", "US"],
//               "Onboarding Date":["2024-05-10", "2023-11-12", "2021-08-09", "2024-05-10", "2023-11-12", "2021-08-09", "2024-05-10", "2023-11-12", "2021-08-09"]
//           }
//       },

//       {
//           "inactive":{
//             "Customer Name":["Fuli skweek", "Yomi atah", "Noh wey", "Sheldon wright", "Klaus dunk", "Emily kate", "Noah Prichard", "Assene stoke", "Phillip Puzzled"],
//             "email":["Fuli.skweek@gmail.com", "Yomi.atah@gmail.com", "Noh.wey@gmail.com", "Sheldon.wright@gmail.com", "Klaus.dunk@gmail.com", "Emily.kate@gmail.com", "Noah.prichard@gmail.com", "Assene.stoke@gmail.com", "Phillip.puzzled@gmail.com"],
//             "Country":['Nigeria', "Nigeria", "US", "Canada", "Canada", "Belgium", "Switzerland", "US", "US"],
//             "Onboarding Date":["2024-05-10", "2023-11-12", "2023-08-09", "2022-08-10", "2023-11-12", "2024-02-09", "2024-05-10", "2023-11-12", "2023-08-09"]
//           }
//       }

//   ];
      
//     setIsLoadingAll(true);
    
//     setPageData(result);
//     console.log(pageData)
//     setIsLoadingAll(false);
      
// };

//   useEffect(() =>
//     {
//       getData();
//       const interval = setInterval(getData, data_refresh);
//       return () => clearInterval(interval);

//   },
// []);



  if (error) {
    return (
      <>
        <nav class="">
            <a href="#" class="flex ml-2 md:mr-24">
                <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SaaS</span>
            </a>
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
    return (

      <div>
        <nav class="">
            <a href="#" class="flex ml-2 md:mr-24">
                <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SaaS</span>
            </a>
        </nav>
        <div className='containerCustomOverview'>
          
          <div className='nameAndFilterRow'>
            <div id='positionNameAndFilters'>
              <h6 id="PageName">
                Analytics Overview
              </h6>
              {/* <p className='lastRefreshed'>
                Last Freshed:
              </p> */}
              <div className="FilterRow">
                <div className="fspDropDown">
                  <span>Customer Name:</span>
                  <select class='optionsClass'>
                    <option value='All'>All</option>
                    <option value='Team Apt'>Team Apt</option>
                    <option value='Flutterwave'>Flutterwave</option>
                  </select>
                </div>
                <div id='date-range-picker' date-rangepicker="true" class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
                        <path clipRule="evenodd" fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"></path>
                      </svg>
                    </div>
                    <input  id='datepicker-range-start' name="start" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="From"/>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
                        <path clipRule="evenodd" fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"></path>
                      </svg>
                    </div>
                    <input id='datepicker-range-end' name="end" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="To"/>
                  </div>
                </div>
                {/* <div className="dateRangeField">
                  <label className="dateLabel">Date: </label>
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
                </div> */}
              </div>
            </div>
          </div>

          <div className='revCard'>
              <div class='card'>
                <div class="card-body">
                  <span class="card-text">Revenue</span>
                  <h1 class="card-title"><Skeleton containerClassName="skeletonFlex" count={1} width={"40%"}/></h1>
                  <br></br>
                  <span class="card-text">Avg. Revenue/user</span>
                  <p id="revperUser" class="card-text"><Skeleton containerClassName="skeletonFlex" count={1} width={"10%"} /></p>
                </div>
              </div>
          </div>

          {/* <div id="Empty">
          </div> */}

          <div className="cacRateCard">
            <div class='card'>
            <h6 class="card-header bg-transparent"></h6>
              <div className='cardPieContent'>
                <div id="leftPieContent">
                  <span class="card-text">Customer Acquisition Rate</span>
                </div>
                <div id="rightPieContent">
                  <Skeleton containerClassName="skeletonFlex" count={1} height={140}/>
                </div>
              </div>
            </div>
          </div>

          <div className="retRateCard">
            <div class='card'>
              <h6 class="card-header bg-transparent"></h6>
              <div className='cardPieContent'>
                <div id="leftPieContent">
                  <span class="card-text">Customer Retention Rate</span>
                </div>
                <div id="rightPieContent">
                  <Skeleton containerClassName="skeletonFlex" count={1} height={140}/>
                </div>
              </div>
            </div>
          </div>
          

          {/* <div className="emptyRow">
          </div> */}

          
          <div className='revTrendCard'>
            <div class='card'>
              <h7 class="card-header bg-transparent">Revenue Trend</h7>
              <div className='cardAreaContent'>
                <Skeleton containerClassName="skeletonFlex" count={1} height={170} width={"98%"}/>
              </div>
            </div>
          </div>
          
          <div className="topCustCard">
            <div class='card'>
              <div className='headerRow'>
                <h7 class="card-header bg-transparent">Top Active Prefixes</h7>
                <p className='activeTabs'>
                  <span id='top-used'>
                    <a href='#' className={activeTab==='top-used'? 'activeTab': 'inactiveTab'}
                    onClick={()=>setActiveTab('top-used')}>Active</a>
                  </span>
                  <span id='top-unused'>
                    <a href='#' className={activeTab==='top-unused'? 'activeTab': 'inactiveTab'}
                    onClick={()=>setActiveTab('top-unused')}>Inactive</a>
                  </span>
                </p>
              </div>
              <br></br>
              <div className="prefixRowData">
                {
                  prefixesLoader.map((eachPrefix, index) =>{
                    return (
                    <>
                      <div className={activeTab==='top-used'? 'eachRowFlex active': 'eachRowFlex'}>
                        <p className='prefixLeftCol'>
                          <span className="dotLoader" ><Skeleton containerClassName="skeletonFlex" count={1} /></span>
                        </p>
                        <div className='prefixRightCol'>
                          <span id="boldHeader"><Skeleton containerClassName="skeletonFlex" count={1} width={"30%"}/></span>
                          <div className='eachBottomRowFlex'>
                            <p className='textDisplay'><Skeleton containerClassName="skeletonFlex" count={1} /></p>
                            <p className='textDisplay'>
                              <Skeleton containerClassName="skeletonFlex" count={1} />
                            </p>
                            <p className='textDisplay'>
                              <Skeleton containerClassName="skeletonFlex" count={1} />
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={activeTab==='top-unused'? 'eachRowFlex active': 'eachRowFlex'}>
                      <p className='prefixLeftCol'>
                        <span className="dotLoader"><Skeleton containerClassName="skeletonFlex" count={1} width={"30%"}/></span>
                      </p>
                      <div className='prefixRightCol'>
                        <span id="boldHeader"><Skeleton containerClassName="skeletonFlex" count={1} /></span>
                        <div className='eachBottomRowFlex'>
                          <p className='textDisplay'><Skeleton containerClassName="skeletonFlex" count={1} /></p>
                          <p>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                          </p>
                          <p>
                            <Skeleton containerClassName="skeletonFlex" count={1} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                    );
                  })
                }
              </div>
            </div>
          </div>
            
        
        
        
        
        
        </div>
    </div>
  );
  } 
  else {
  return (
    <div>
        <nav class="navbar navbar-expand-lg" id="nav-bg-color">
          <div class="container-fluid">
            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SaaS</span>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link active" id = "active-nav" aria-current="page" href="#">Analytics</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id = "inactive-nav" aria-disabled="true" href="/transaction">Transactions</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='containerCustomOverview'>
          
          <div className='nameAndFilterRow'>
            <div id='positionNameAndFilters'>
              <h6 id="PageName">
                Analytics Overview
              </h6>
              {/* <p className='lastRefreshed'>
                Last Freshed: {pageData[0]['overall']['Last Refresh']}
              </p> */}
              <div className="FilterRow">
                <div className="fspDropDown">
                  <span>Product Name:</span>
                  <select class='optionsClass'>
                    {pageData[0]['overall']['All products'].map((eachProduct, index) =>{
                        return (
                            <option value={eachProduct}>{eachProduct}</option>
                        )
                        })
                        
                        }
                  </select>
                </div>
                <div id='date-range-picker' date-rangepicker="true" class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
                        <path clipRule="evenodd" fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"></path>
                      </svg>
                    </div>
                    <input  id='datepicker-range-start' name="start" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Start Date"/>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
                        <path clipRule="evenodd" fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"></path>
                      </svg>
                    </div>
                    <input id='datepicker-range-end' name="end" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="End Date"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='revCard'>
              <div class='card'>
                <div class="card-body">
                  <span class="text-base">Revenue</span>
                  <h1 class="text-3xl font-bold">$4,876,120</h1>
                  <br></br>
                  <span class="card-text">Avg. Revenue/user</span>
                  <p id="revperUser" class="card-text">$9,001.45</p>
                </div>
              </div>
          </div>

          {/* <div id="Empty">
          </div> */}

          <div className="cacRateCard">
            <div class='card'>
            <h6 class="card-header bg-transparent"></h6>
              <div className='cardPieContent'>
                <div id="leftPieContent">
                  <span class="card-text">Customer Acquisition Rate</span>
                </div>
                <div id="rightPieContent">
                  <CreateChart
                    name = "CAR"
                    contentData = {generateChart("CAR", "pie")}
                    displayCarRateText = "31%"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="retRateCard">
            <div class='card'>
              <h6 class="card-header bg-transparent"></h6>
              <div className='cardPieContent'>
                <div id="leftPieContent">
                  <span class="card-text">Customer Retention Rate</span>
                </div>
                <div id="rightPieContent">
                  <CreateChart
                    name = "CRR"
                    contentData = {generateChart("CRR", "pie")}
                    displayCrrRateText = "24%"
                  />
                </div>
              </div>
            </div>
          </div>
          

          {/* <div className="emptyRow">
          </div> */}

          
          <div className='revTrendCard'>
            <div class='card'>
              <h7 class="card-header bg-transparent">Revenue Trend</h7>
              <div className='cardAreaContent'>
                  <CreateChart
                    name = "revTrend"
                    contentData = {generateChart("revTrend", "scatter")}
                  />
              </div>
            </div>
          </div>
          
          <div className="topCustCard">
            <div class='card'>
              <div className='headerRow'>
                {/* <h7 class="card-header bg-transparent">Top Active Prefixes</h7>
                <p className='activeTabs'>
                  <span id='top-used'>
                    <a href='#' className={activeTab==='top-used'? 'activeTab': 'inactiveTab'}
                    onClick={()=>setActiveTab('top-used')}>Active</a>
                  </span>
                  <span id='top-unused'>
                    <a href='#' className={activeTab==='top-unused'? 'activeTab': 'inactiveTab'}
                    onClick={()=>setActiveTab('top-unused')}>Inactive</a>
                  </span>
                </p> */}
                <ul class="hidden text-sm mt-4 w-[90%] mx-auto font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex" id="fullWidthTab" data-tabs-toggle="#fullWidthTabContent" role="tablist">
                  <li class="w-full">
                      <button id="top-customers-tab" data-tabs-target="#topcust" type="button" role="tab" aria-controls="topcust" aria-selected="true" class="inline-block w-full p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-100 focus:outline-none">Top active customers </button>
                  </li>
                  <li class="w-full">
                      <button id="top-inactive-tab" data-tabs-target="#topinactive" type="button" role="tab" aria-controls="topinactivebout" aria-selected="false" class="inline-block w-full p-4 rounded-tr-lg bg-gray-50 hover:bg-gray-100 focus:outline-none">Top inactive</button>
                  </li>
                </ul>
              </div>
              <div id="fullWidthTabContent" class="w-[90%] mx-auto border-t border-gray-200 overflow-y-scroll">
                <div class="hidden pt-4" id="topcust" role="tabpanel" aria-labelledby="top-customers-tab">
                  <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                      {
                        pageData[1]["topCust"]["Customer Name"].map((eachCustomer, index) =>{
                          return (
                          <>
                          <li class="py-[0.2rem]">
                            <div class="flex items-
                            center justify-between">
                              <div class="flex items-center min-w-0">
                                <p className='prefixLeftCol'>
                                  <span className="dot" id="dot-used">{index+1}</span>
                                </p>
                                <div class="ml-3">
                                  <p class="font-medium text-gray-900 truncate dark:text-white">
                                    {eachCustomer}
                                  </p>
                                  <div class="flex items-center justify-end flex-1 text-xs text-green-500 dark:text-green-400">
                                    <span class="text-gray-500">Email: {pageData[1]["topCust"]["email"][index]} | &nbsp; </span>
                                    <span class="text-gray-500">Country: {pageData[1]["topCust"]["Country"][index]}</span>
                                  </div>
                                </div>
                              </div>
                              <div class="flex-col mr-3 items-center text-center">
                                <p class='text-lg font-semibold text-gray-900 dark:text-white'>{pageData[1]["topCust"]["subscription"][index]}</p>
                                <span class="text-xs mt-0 text-gray-500">Total subscriptions</span>
                              </div>
                            </div>
                          </li>
                          </>
                          )

                        }
                      )

                      }
                          
                  </ul>
                </div>
                <div class="hidden pt-4" id="topinactive" role="tabpanel" aria-labelledby="top-inactive-tab">
                  <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                  {
                      pageData[2]["inactive"]["Customer Name"].map((eachCustomer, index) =>{
                        return (
                        <>
                        <li class="py-[0.2rem]">
                          <div class="flex items-
                          center justify-between">
                            <div class="flex items-center min-w-0">
                              <p className='prefixLeftCol'>
                                <span className="dot" id="dot-unused">{index+1}</span>
                              </p>
                              <div class="ml-3">
                                <p class="font-medium text-gray-900 truncate dark:text-white">
                                  {eachCustomer}
                                </p>
                                <div class="flex items-center justify-end flex-1 text-xs text-green-500 dark:text-green-400">
                                  <span class="text-gray-500">Email: {pageData[2]["inactive"]["email"][index]} | &nbsp; </span>
                                  <span class="text-gray-500">Country: {pageData[2]["inactive"]["Country"][index]}</span>
                                </div>
                              </div>
                            </div>
                            <div class="flex-col mr-3 items-center text-center">
                              <p class='text-sm font-semibold text-gray-900 dark:text-white'>{pageData[2]["inactive"]["Onboarding Date"][index]}</p>
                              <span class="text-xs mt-0 text-gray-500">Last login Date</span>
                            </div>
                          </div>
                        </li>
                        </>
                        )

                      }
                    )

                    }
                  </ul>
                </div>
              </div>
              
              {/* <br></br> */}
              {/* <div className="prefixRowData">
                    {
                      pageData[1]["topCust"]["Customer Name"].map((eachCustomer, index) =>{
                        return (
                        <>
                          <div className={activeTab==='top-used'? 'eachRowFlex active': 'eachRowFlex'}>
                            <p className='prefixLeftCol'>
                              <span className="dot" id="dot-used">{index+1}</span>
                            </p>
                            <div className='prefixRightCol'>
                              <div className='eachBottomRowFlex'>
                                <p>Customer Name: {eachCustomer}</p>
                                <p>Onboarding Date: {pageData[1]["topCust"]["Onboarding Date"][index]}</p>
                                <p>
                                  <span>Email: </span> 
                                  <span id="revTextColor">{pageData[1]["topCust"]["email"][index]}</span>
                                </p>
                                <p>
                                  <span>Country: </span>
                                  <span id="revTextColor">{pageData[1]["topCust"]["Country"][index]}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )})
                    }
                    
                    {
                      pageData[2]["inactive"]["Customer Name"].map((eachCustomer, index) =>{
                        return (
                        <>
                          <div className={activeTab==='top-unused'? 'eachRowFlex active': 'eachRowFlex'}>
                          <p className='prefixLeftCol'>
                            <span className="dot" id="dot-unused">{index+1}</span>
                          </p>
                          <div className='prefixRightCol'>
                            <div className='eachBottomRowFlex'>
                                <p>Customer Name: {eachCustomer}</p>
                                <p>Onboarding Date: {pageData[2]["inactive"]["Onboarding Date"][index]}</p>
                                <p>
                                  <span>Email: </span> 
                                  <span id="revTextColor">{pageData[2]["inactive"]["email"][index]}</span>
                                </p>
                                <p>
                                  <span>Country: </span>
                                  <span id="revTextColor">{pageData[2]["inactive"]["Country"][index]}</span>
                                </p>
                              </div>
                          </div>
                        </div>
                      </>
                    );
                  })
                  }
              </div> */}
            </div>
          </div>
            
        
        
        
        
        
        </div>
    </div>
  );
}

}

export default Overview;