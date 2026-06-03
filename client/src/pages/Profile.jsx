import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import ThemeContext from "../context/ThemeContext";
import Card from "../components/ui/Card";
import { Calendar, Ruler, Scale, Target, User } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { goalOptions } from "../assets/assets";
import { LogOutIcon, SunIcon, MoonIcon } from "lucide-react";
//check use effect later
/*
.page-container {
  @apply min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-200;
}

.page-header {
  @apply bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 pt-12 transition-colors duration-200;
}

.profile-content {
  @apply p-4 lg:p-6 space-y-4 lg:grid grid-cols-2 gap-6;
}

.profile-info-row {
  @apply flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200;
}
 */
const Profile = () => {
  const { user, setUser, logout, fetchUser, allFoodLogs, allactivityLogs } =
    useContext(AppContext);
  const { theme, themeToggle } = useContext(ThemeContext);

  const handleSave = async () => {
    try {
      // TODO: Replace with Strapi API call later
      // const { data } = await api.user.update(user.id, formData);
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });

  const fetchUserData = () => {
    if (user) {
      setFormData({
        age: user?.age || 0,
        weight: user?.weight || 0,
        height: user?.height || 0,
        goal: user?.goal || "maintain",
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400,
      });
    }
  };

  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivities = allactivityLogs?.length || 0;
    return { totalFoodEntries, totalActivities };
  };

  const stats = getStats();

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user || !formData) return null;
  return (
    <div className="page-container">
      {/* header */}
      <div className="page-header">
        <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-100">
          Profile
        </h3>
        <p className="text-sm text-slate-500 dark:textlate-400">
          Manage your Settings
        </p>
      </div>
      {/* profile content */}
      <div className="profile-content">
        {/* left col */}
        <Card>
          {/* card title */}
          <div className="flex gap-3 items-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="dark:text-white text-slate-700 font-semibold">
                Your Profile
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Member since{" "}
                {new Date(user?.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(v) => setFormData({ ...formData, age: Number(v) })}
                min={13}
                max={120}
              />
              <Input
                label="Weight(kg)"
                type="number"
                value={formData.weight}
                onChange={(v) =>
                  setFormData({ ...formData, weight: Number(v) })
                }
                min={20}
                max={300}
              />
              <Input
                label="Height(cm)"
                type="number"
                value={formData.height}
                onChange={(v) =>
                  setFormData({ ...formData, height: Number(v) })
                }
                min={100}
                max={200}
              />
              <Select
                label="Fitness Goal"
                value={formData.goal}
                onChange={(v) => setFormData({ ...formData, goal: v })}
                options={goalOptions}
              />
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      age: user.age,
                      weight: user.weight,
                      height: user.height,
                      goal: user.goal || "",
                      dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                      dailyCalorieBurn: user.dailyCalorieBurn || 400,
                    });
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="profile-info-row">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center dark:bg-slate-700 bg-slate-200">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Age
                    </p>
                    <p className=" dark:text-slate-100 text-slate-800">
                      {user.age} years
                    </p>
                  </div>
                </div>
                <div className="profile-info-row">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center dark:bg-slate-700 bg-slate-200">
                    <Scale className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Weight
                    </p>
                    <p className=" dark:text-slate-100 text-slate-800">
                      {user.weight} kg
                    </p>
                  </div>
                </div>
                <div className="profile-info-row">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center dark:bg-slate-700 bg-slate-200">
                    <Ruler className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Height
                    </p>
                    <p className=" dark:text-slate-100 text-slate-800">
                      {user.height} cm
                    </p>
                  </div>
                </div>
                <div className="profile-info-row">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center dark:bg-slate-700 bg-slate-200">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Goal
                    </p>
                    <p className=" dark:text-slate-100 text-slate-800">
                      {user.goal} weight
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
        </Card>
        {/* right col */}
        <div className="space-y-4">
          {/* stats card */}
          <Card>
            <p className="text-slate-800 font-semibold dark:text-slate-100 mb-4">
              Your Stats
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 text-center bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <p className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                  {stats.totalFoodEntries}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Food Entries
                </p>
              </div>
              <div className="p-4 text-center bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                  {stats.totalActivities}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Activities
                </p>
              </div>
            </div>
          </Card>
          {/* theme toggle for small screen */}
          <div className="lg:hidden">
            <button
              className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors duration-200 cursor-pointer"
              onClick={themeToggle}
            >
              {theme === "light" ? (
                <MoonIcon className="size-5" />
              ) : (
                <SunIcon className="size-5" />
              )}

              <span className="text-base">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>
          </div>
          {/* Logout button */}
          <Button
            variant="danger"
            onClick={logout}
            className="w-full ring ring-red-300 hover:ring-2"
          >
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
