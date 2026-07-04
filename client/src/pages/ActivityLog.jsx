import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../config/api";
import { quickActivities } from "../assets/assets";
import { Activity, Dumbbell, TimerIcon, Trash2Icon } from "lucide-react";

/*
.activity-entry-item {
  @apply flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200;

  .page-container {
  @apply min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-200;
}

.page-header {
  @apply bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 pt-12 transition-colors duration-200;
}


.page-content-grid {
  @apply p-4 lg:p-6 space-y-4 lg:grid lg:grid-cols-2 lg:gap-6;
}
*/

const ActivityLog = () => {
  const { allActivityLogs, setAllActivityLogs } = useContext(AppContext);

  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    calories: 0,
  });

  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const loadActivities = () => {
    const todayActivities = allActivityLogs.filter(
      (a) => a.createdAt?.split("T")[0] === today,
    );

    setActivities(todayActivities);
  };

  useEffect(() => {
    loadActivities();
  }, [allActivityLogs]);

  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);

  const handleQuickAdd = (activity) => {
    setFormData({
      name: activity.name,
      duration: 30,
      calories: 30 * activity.rate,
    });
    setShowForm(true);
  };

  const handleDurationChange = (val) => {
    const duration = Number(val);
    const activity = quickActivities.find((a) => a.name === formData.name);
    let calories = formData.calories;
    if (activity) {
      calories = duration * activity.rate;
    }
    setFormData({ ...formData, duration, calories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.duration <= 0) {
      return toast.error("Please enter valid data");
    }
    try {
      const { data } = await api.post("/api/activity-logs", { data: formData });
      setAllActivityLogs((prev) => [...prev, data]);
      setShowForm(false);
      toast.success("Activity Logged Successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  //handle delete
  const handleDelete = async (documentId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this activity?",
      );
      if (!confirmDelete) return;
      await api.delete(`/api/activity-logs/${documentId}`);
      setAllActivityLogs((prev) =>
        prev.filter((a) => a.documentId != documentId),
      );
      toast.success("Activity Deleted Successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-2xl mb-2 dark:text-white text-slate-800">
              Activity Log
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track Your Workouts
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Today</p>
            <p className="text-xl font-bold dark:text-blue-400 text-blue-600">
              {totalMinutes} min
            </p>
          </div>
        </div>
      </div>
      <div className="page-content-grid">
        {/* Quick add section */}
        {!showForm && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Quick Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActivities.map((activity) => (
                  <button
                    key={activity.name}
                    onClick={() => handleQuickAdd(activity)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:cursor-pointer"
                  >
                    {activity.name} {activity.emoji}
                  </button>
                ))}
              </div>
            </Card>
            <Button onClick={() => setShowForm(true)} className="w-full">
              + Add Custom Activity
            </Button>
          </div>
        )}
        {/* Add form */}
        {showForm && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-slate-800 dark:text-white font-semibold  mb-4">
              New Activity
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Activity Name"
                placeholder="eg..Morning Walk"
                required
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <div className="flex gap-4">
                <Input
                  label="Duration(min.)"
                  type="number"
                  placeholder="30"
                  min={1}
                  max={300}
                  required
                  value={formData.duration}
                  onChange={handleDurationChange}
                  className="flex-1"
                />
                <Input
                  label="Calories Burned"
                  placeholder="eg..Morning Walk"
                  type="number"
                  required
                  value={formData.calories}
                  onChange={(v) => setFormData({ ...formData, calories: v })}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-3 mb-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", duration: 0, calories: 0 });
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Activity
                </Button>
              </div>
            </form>
          </Card>
        )}
        {/* Activities list */}
        {activities.length === 0 ? (
          <Card className="text-center py-12 space-y-2">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <Dumbbell className="h-8 w-8 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <p className="font-semibold text-slate-800 dark:text-white">
              No activities logged today
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Start moving and track your progress
            </p>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-800 dark:text-slate-100 font-semibold">
                  Today's Activities
                </h3>
                <p className="text-sm dark:text-slate-400 text-slate-500">
                  {activities.length} logged
                </p>
              </div>
            </div>

            {/* activities listing */}
            <div className="space-y-2">
              {activities.map((a) => (
                <div key={a.id} className="activity-entry-item">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <TimerIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gslate-800 dark:text-slate-100 font-medium">
                        {a.name}
                      </p>
                      <p className="text-sm text-late-500 dark:text-slate-400">
                        {new Date(a?.createdAt || "").toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="text-right">
                      <p className="text-gslate-800 dark:text-slate-100 font-medium">
                        {a.duration} min
                      </p>
                      <p className="text-sm text-late-500 dark:text-slate-400">
                        {a.calories} kcal
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(a.documentId)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* total summary */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Total Active Time
              </span>
              <span className="text-lg font-bold dark:text-blue-400 text-blue-600">
                {totalMinutes} Minutes
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
