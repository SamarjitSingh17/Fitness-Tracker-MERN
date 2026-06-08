import React, { useContext, useEffect, useState } from "react";
import { getMotivationalMessage } from "../assets/assets";
import AppContext from "../context/AppContext";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import api from "../config/api";
import {
  Activity,
  Car,
  FlameIcon,
  HamburgerIcon,
  Ruler,
  ScaleIcon,
  TrendingUp,
  ZapIcon,
} from "lucide-react";
import CaloriesChart from "../components/CaloriesChart";
/*
***dashboard
.dashboard-header {
  @apply bg-linear-to-br from-emerald-500 to-emerald-600 text-white p-6 pt-12 pb-20 rounded-b-3xl;
}

.dashboard-grid {
  @apply px-4 -mt-10 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-6 lg:max-w-4xl lg:mx-auto;
}

.dashboard-card-grid {
  @apply grid grid-cols-2 gap-4 lg:col-span-2;
}

***Shared pages
.page-container {
  @apply min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-200;
}

.page-header {
  @apply bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 pt-12 transition-colors duration-200;
}
*/
const Dashboard = () => {
  const { user, allFoodLogs, allActivityLogs } = useContext(AppContext);
  const [todayFood, setTodayFood] = useState([]);
  const [todayActivity, setTodayActivity] = useState([]);
  const DAILY_CALORIES_LIMIT = user?.dailyCalorieIntake || 2000;
  const bmi = user?.weight
    ? Number(user.weight / Math.pow(user.height / 100, 2))
    : 24.5;
  const getStatus = () => {
    if (bmi < 18.5) {
      return {
        color: "text-blue-500",
        bg: "bg-blue-500",
      };
    }
    if (bmi < 25) {
      return {
        color: "text-green-500",
        bg: "bg-green-500",
      };
    }
    if (bmi < 30) {
      return {
        color: "text-orange-500",
        bg: "bg-orange-500",
      };
    }
    return {
      color: "text-red-500",
      bg: "bg-red-500",
    };
  };
  const status = getStatus(bmi);
  const loadUserData = () => {
    //  aj ki date taakiyeh pta lgge ki aj kya khaya
    const today = new Date().toISOString().split("T")[0];
    // jo aj khaya usse extratct kro food log se
    const foodData = allFoodLogs.filter(
      (f) => f.createdAt.split("T")[0] === today,
    );
    setTodayFood(foodData);
    const activityData = allActivityLogs.filter(
      (a) => a.createdAt.split("T")[0] === today,
    );
    setTodayActivity(activityData);
  };

  useEffect(() => {
    loadUserData();
  }, [allActivityLogs, allFoodLogs]);

  const caloriesConsumed = todayFood.reduce((sum, f) => sum + f.calories, 0);
  const remainingCalories = DAILY_CALORIES_LIMIT - caloriesConsumed;
  const totalActiveMinutes = todayActivity.reduce(
    (sum, a) => sum + a.duration,
    0,
  );
  const totalBurned = todayActivity.reduce((sum, a) => sum + a.calories, 0);

  const motivation = getMotivationalMessage(
    caloriesConsumed,
    totalActiveMinutes,
    DAILY_CALORIES_LIMIT,
  );
  return (
    <div className="page-container">
      {/* dashboard header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome Back</p>
        <h1 className="text-2xl font-bold mt-1">
          {`Hi There! ${user?.username || "Demo User"}`}
        </h1>
        {/* Motivation card */}
        <div className="mt-6 bg-white/20 backdrop-blur-sm">
          <div className="flex gap-3 items-center">
            <span className="text-3xl">{motivation.emoji}</span>
            <p className="font-medium">{motivation.text}</p>
          </div>
        </div>
      </div>
      {/*main content */}
      <div className="dashboard-grid">
        {/* calories card */}
        <Card className="shadow-lg col-span-2">
          <div className="flex justify-between items-center mb-4">
            {/* icon and text */}
            <div className="flex items-center gap-3">
              <div className="size-10 bg-orange-200 flex justify-center items-center rounded-lg">
                <HamburgerIcon className="size-7 text-orange-500" />
              </div>
              <div>
                <p className="text-sm dark:text-slate-400 text-slate-500">
                  Consumed Calories
                </p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">
                  {caloriesConsumed}
                </p>
              </div>
            </div>
            <div>
              <span className="text-sm dark:text-slate-400 text-slate-500">
                Limit
              </span>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                {DAILY_CALORIES_LIMIT}
              </p>
            </div>
          </div>
          <ProgressBar value={caloriesConsumed} max={DAILY_CALORIES_LIMIT} />
          {/* Calories remaining */}
          <div className="flex justify-between items-center mt-1 mb-4">
            <div
              className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400"}`}
            >
              <p className="text-sm font-medium">
                {remainingCalories >= 0
                  ? `${remainingCalories} Kcal remaining`
                  : `${Math.abs(remainingCalories)} Kcal over`}
              </p>
            </div>
            <span className="text-sm text-slate-400">
              {Math.round((caloriesConsumed / DAILY_CALORIES_LIMIT) * 100)}%
            </span>
          </div>
          {/* Separting line */}
          <div className="border-t border-slate-100 dark:border-slate-800 mb-4"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-orange-200 flex justify-center items-center rounded-lg">
                <FlameIcon className="size-7 text-orange-500" />
              </div>
              <div>
                <p className="text-sm dark:text-slate-400 text-slate-500">
                  Calories Burned
                </p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">
                  {totalBurned}
                </p>
              </div>
            </div>
            <div>
              <span className="text-sm dark:text-slate-400 text-slate-500">
                Limit
              </span>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                {user?.dailyCalorieBurn || 400}
              </p>
            </div>
          </div>
          <ProgressBar
            value={totalBurned}
            max={user?.dailyCalorieBurn || 400}
          />
        </Card>
        {/* stats row */}
        <div className="dashboard-card-grid">
          {/* Active minutes */}
          <Card>
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex justify-center items-center bg-blue-100">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-slate-500">Active</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {totalActiveMinutes}
            </p>
            <p className="text-sm text-slate-400">Minutes today</p>
          </Card>
          {/* Activiteis count */}
          <Card>
            <div className="flex gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex justify-center items-center bg-blue-100">
                <ZapIcon className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm text-slate-500">Workouts</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {todayActivity.length}
            </p>
            <p className="text-sm text-slate-400">Activities Logged</p>
          </Card>
        </div>
        {/* Goal card */}
        <Card className="bg-linear-to-r from-slate-800 to-slate-700">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl flex justify-center items-center bg-slate-600">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm ">Your Goal</p>
              <p className="text-white font-semibold capitalize">
                {user.goal === "lose" && "🔥Lose weight"}
                {user.goal === "gain" && "💪Gain weight"}
                {user.goal === "maintain" && "⚖️Maintain weight"}
              </p>
            </div>
          </div>
        </Card>

        {/* Body metrics card */}
        <Card>
          <div className="flex gap-4 mb-6 items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex justify-center items-center">
              <ScaleIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="dark:text-white text-slate-800 font-semibold capitalize">
                Body Metrics
              </h3>
              <p className="text-slate-500 text-sm">Your Stats</p>
            </div>
          </div>
          <div className="flex justify-between items-center my-4">
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 dark:bg-slate-600 bg-slate-200 rounded-md flex justify-center items-center">
                <ScaleIcon className="w-4 h-4 dark:text-slate-100 text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">Weight</p>
            </div>

            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.weight || "85"} kg
            </p>
          </div>

          <div className="flex justify-between items-center my-4">
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 dark:bg-slate-600 bg-slate-200 rounded-md flex justify-center items-center">
                <Ruler className="w-4 h-4 dark:text-slate-100 text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">Height</p>
            </div>

            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.height || "185"} cm
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 dark:border-slate-100">
            <div className="flex justify-between">
              <p className="dark:text-white text-slate-800 font-semibold">
                BMI
              </p>
              <p className={`text-lg font-bold ${status.color}`}>
                {bmi.toFixed(2)}
              </p>
            </div>
          </div>
          <div className=" h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-blue-400 "></div>
            <div className="flex-1 bg-green-400 "></div>
            <div className="flex-1 bg-orange-400 "></div>
            <div className="flex-1 bg-red-400 "></div>
          </div>
          <div className="flex justify-between text-sm dark:text-white text-slate-600">
            <p>18.5</p>
            <p>25</p>
            <p>30</p>
          </div>
        </Card>
        {/* Today's Summary */}
        <Card>
          <h3 className="text-slate-800 font-semibold  dark:text-slate-100 mb-4">
            Today's Summary
          </h3>
          <div className="space-y-3 py-2 border-b border-slate-800 dark:border-slate-100 flex justify-between items-center">
            <p className="text-gray-500 text-sm">Meals Logged</p>
            <p className="text-sm dark:text-white text-slate-800">
              {todayFood.length}
            </p>
          </div>
          <div className="space-y-3 py-2  border-b border-slate-800 dark:border-slate-100 flex justify-between items-center">
            <p className="text-gray-500 text-sm">Total Colories</p>
            <p className="text-sm dark:text-white text-slate-800">
              {caloriesConsumed} Kcal
            </p>
          </div>
          <div className="space-y-3 py-2 flex justify-between items-center">
            <p className="text-gray-500 text-sm">Active Time</p>
            <p className="text-sm dark:text-white text-slate-800">
              {totalActiveMinutes} min
            </p>
          </div>
        </Card>
        {/* Activity and food intake graph */}
        <Card className="col-span-2">
          <h3 className="font-semibold dark:text-slate-200 text-slate-800 mb-2">
            This Week's Progress
          </h3>
          <CaloriesChart />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
