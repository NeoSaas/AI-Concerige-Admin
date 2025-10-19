import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { ClockIcon, ClipboardIcon, CursorArrowRaysIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { prepareChartData } from "@/data/prepareChartData";
import PreviewPage from "./preview/PreviewPage";

export function Home() {
  const [todayLogData, setTodayLogData] = useState([]);
  const [allTimeLogData, setAllTimeLogData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const getLogData = async () => {
      const response = await axios.get('https://ai-concierge-main-0b4b3d25a902.herokuapp.com/api/getLogs/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      const { today_logs, all_time_logs } = response.data;
      setTodayLogData(today_logs);
      setAllTimeLogData(all_time_logs);
    };
    const getBusinessData = async () => {
      const response = await axios.get('https://ai-concierge-main-0b4b3d25a902.herokuapp.com/api/getUserBusinessData/', {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      setBusinessData(response.data);
      // console.log(response.data)
    };
    getBusinessData();
    getLogData();
  }, []);

  const itineraryChartData = prepareChartData(allTimeLogData, 'itinerary_recommendation');
  const recommendationChartData = prepareChartData(allTimeLogData, 'recommendation');
  const clickChartData = prepareChartData(allTimeLogData, 'click');
  let clicksToday = todayLogData.filter(log => log.event_type === "click").length;
  let recommendationsToday = todayLogData.filter(log => log.event_type === "recommendation").length;
  let itineraryRecommendationsToday = todayLogData.filter(log => log.event_type === "itinerary_recommendation").length;
  // console.log(businessData);

  return (
    <div className="mt-12 flex flex-col">
      <div className="justify-center mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {todayLogData ? 
          (
          <>
            <StatisticsCard
            key={`${allTimeLogData[0]?.business__business_name}-recommendations`}
            title={`${allTimeLogData[0]?.business__business_name} - Todays recommendation stats`}
            value={recommendationsToday}
            color="gray"
            icon={React.createElement(ClipboardIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong>0</strong> {allTimeLogData[0]?.event_type}
              </Typography>
            }
            />
            <StatisticsCard
            key={`$${allTimeLogData[0]?.business__business_name}-clicks`}
            title={`${allTimeLogData[0]?.business__business_name} - Todays clicks stats`}
            value={clicksToday}
            color="gray"
            icon={React.createElement(CursorArrowRaysIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong>0</strong> {allTimeLogData[0]?.event_type}
              </Typography>
            }
            />
            <StatisticsCard
            key={`${allTimeLogData[0]?.business__business_name}-clicks`}
            title={`${allTimeLogData[0]?.business__business_name} - Todays Itinerary rec' stats`}
            value={itineraryRecommendationsToday}
            color="gray"
            icon={React.createElement(DocumentTextIcon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong>0</strong> {allTimeLogData[0]?.event_type}
              </Typography>
            }
            />
          </>
        ):
          (todayLogData.map(({ business__business_name, event_type, count }) => (
            <StatisticsCard
              key={`${business__business_name}-${event_type}`}
              title={`${business__business_name} - Todays ${event_type} stats`}
              value={count}
              color="gray"
              icon={React.createElement(ClipboardIcon, {
                className: "w-6 h-6 text-white",
              })}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong>{count}</strong> {event_type}s
                </Typography>
              }
            />
            
          ))
        )
        }
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsChart
          color="white"
          chart={itineraryChartData}
          title="All-time Itinerary Recommendations"
          description="This chart shows all-time data for itinerary recommendations."
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;Updated just now
            </Typography>
          }
        />
        <StatisticsChart
          color="white"
          chart={recommendationChartData}
          title="All-time Recommendations"
          description="This chart shows all-time data for recommendations."
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;Updated just now
            </Typography>
          }
        />
        <StatisticsChart
          color="white"
          chart={clickChartData}
          title="All-time Clicks"
          description="This chart shows all-time data for clicks."
          footer={
            <Typography
              variant="small"
              className="flex items-center font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;Updated just now
            </Typography>
          }
        />
      </div>
      <div className="flex justify-center items-center mb-4 flex-col w-full border border-blue-gray-100 shadow-sm rounded-xl">
        <h1 className="text-5xl font-semibold text-blue-gray-800 mt-10 mb-3">Your Business Page Preview</h1>
          <PreviewPage values={businessData} />
      </div>
    </div>
  );
}

export default Home;
