import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import AppContext from "../context/AppContext";
import Card from "../components/ui/Card";
import {
  mealTypeOptions,
  quickActivitiesFoodLog,
  mealIcons,
  mealColors,
} from "../assets/assets";
import Button from "../components/ui/Button";
import {
  PlusIcon,
  SparkleIcon,
  Loader2Icon,
  UtensilsCrossedIcon,
  CoffeeIcon,
  SunIcon,
  MoonIcon,
  CookieIcon,
  Trash2Icon,
} from "lucide-react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
/*

.food-entry-item {
  @apply flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-200;
}
  .page-container {
  @apply min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-200;
}

.page-header {
  @apply bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 pt-12 transition-colors duration-200;
}
  .page-content-grid {
  @apply p-4 lg:p-6 space-y-4 lg:grid lg:grid-cols-2 lg:gap-6;
}

MEAL ASSETS:
export const mealTypeOptions = [
    { value: "breakfast", label: "🌅 Breakfast" },
    { value: "lunch", label: "☀️ Lunch" },
    { value: "dinner", label: "🌙 Dinner" },
    { value: "snack", label: "🍪 Snack" },
];

export const quickActivitiesFoodLog = [
    { name: "breakfast", emoji: "🌮" },
    { name: "lunch", emoji: "🌅" },
    { name: "dinner", emoji: "🌙" },
    { name: "snack", emoji: "🍪" },
];

export const mealColors = {
    breakfast: "bg-amber-100 text-amber-600",
    lunch: "bg-orange-100 text-orange-600",
    dinner: "bg-indigo-100 text-indigo-600",
    snack: "bg-pink-100 text-pink-600",
};

export const mealIcons = {
    breakfast: CoffeeIcon,
    lunch: SunIcon,
    dinner: MoonIcon,
    snack: CookieIcon,
};


 */
const FoodLog = () => {
  const { allFoodLogs, setAllFoodLogs } = useContext(AppContext);
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: 0,
    mealType: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.calories <= 0 || !formData.mealType) {
      return toast.error("Please enter valid data");
    }
    try {
      // TODO: Replace with Strapi API call later
      // const { data } = await api.foodLogs.create({ data: formData });
      const newEntry = {
        id: Date.now(),
        documentId: "doc_food_" + Date.now(),
        name: formData.name,
        calories: Number(formData.calories),
        mealType: formData.mealType,
        createdAt: new Date().toISOString(),
      };

      const updatedLogs = [...allFoodLogs, newEntry];
      localStorage.setItem("foodLogs", JSON.stringify(updatedLogs));
      setAllFoodLogs(updatedLogs);

      setFormData({ name: "", calories: 0, mealType: "" });
      setShowForm(false);
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message || "Failed to add food log");
    }
  };

  //input ref for ai image
  const inputRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];
  const loadEntries = () => {
    const todayEntries = allFoodLogs.filter(
      (f) => f.createdAt?.split("T")[0] === today,
    );
    setEntries(todayEntries);
  };
  useEffect(() => {
    loadEntries();
  }, [allFoodLogs]);

  const totalCalories = entries.reduce((sum, f) => sum + f.calories, 0);

  /* ***Group by meal Type*** */
  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);

    return acc;
  }, {});

  const handleQuickAdd = (f) => {
    setFormData({ ...formData, mealType: f.name });
    setShowForm(true);
  };

  const handleDelete = async (documentId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this entry?",
      );

      if (!confirmDelete) return;

      const updatedLogs = allFoodLogs.filter((e) => e.documentId !== documentId);
      localStorage.setItem("foodLogs", JSON.stringify(updatedLogs));
      setAllFoodLogs(updatedLogs);
      toast.success("Food entry deleted!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete food entry");
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-2xl dark:text-white text-slate-700">
              Food Log
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Track Your Daily Meals
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Today's Total
            </p>
            <p className="font-bold text-lg dark:text-emerald-400 text-emerald-600">
              {totalCalories} Kcal
            </p>
          </div>
        </div>
      </div>
      <div className="page-content-grid">
        {/* Quick add section */}
        {!showForm && (
          <div className="space-y-4">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Quick Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActivitiesFoodLog.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => handleQuickAdd(f)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:cursor-pointer"
                  >
                    {f.emoji}
                    {f.name}
                  </button>
                ))}
              </div>
            </Card>
            <Button onClick={() => setShowForm(true)} className="w-full">
              <PlusIcon className="size-5" />
              Add Food Entry
            </Button>
            <Button
              onClick={() => inputRef.current?.click()}
              className="w-full"
            >
              <SparkleIcon className="size-5" />
              Upload Image(AI)
            </Button>
            <input type="file" hidden accept="image/*" ref={inputRef} />
            {loading && (
              <div className="fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur flex items-center justify-center z-100">
                <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
            )}
          </div>
        )}
        {/* Add Form */}
        {showForm && (
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-slate-800 dark:text-white font-semibold  mb-4">
              New Food Entry
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Food Name"
                placeholder="eg... Salad"
                required
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <Input
                label="Calories"
                type="number"
                placeholder="0"
                min={1}
                required
                value={formData.calories}
                onChange={(v) => setFormData({ ...formData, calories: v })}
              />
              <Select
                label="Meal Type"
                value={formData.mealType}
                onChange={(v) => setFormData({ ...formData, mealType: v })}
                options={mealTypeOptions}
                placeholder="Select Meal Type"
                required
              />
              {/* {error && <p className="text-sm text-red-500">{error}</p>} */}
              <div className="flex gap-3 mb-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", calories: 0, mealType: "" });
                    // setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Food
                </Button>
              </div>
            </form>
          </Card>
        )}
        {/* Food entry List */}
        {entries.length === 0 ? (
          <Card className="text-center py-12 space-y-2">
            <div className="flex items-center justify-center">
              <div className="h-16 w-16 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <UtensilsCrossedIcon className="h-8 w-8 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <p className="font-semibold text-slate-800 dark:text-white">
              No food logged today
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Start Tacking your meals to saty on target
            </p>
          </Card>
        ) : (
          //  food entered list
          <div className="space-y-4">
            {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
              if (!groupedEntries[mealType]) return null;

              const MealIcon = mealIcons[mealType];

              const mealCalories = groupedEntries[mealType].reduce(
                (sum, food) => sum + food.calories,
                0,
              );

              return (
                <Card key={mealType}>
                  <div className="flex items-center justify-between mb-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealType]}`}
                      >
                        <MealIcon className="size-5" />
                      </div>

                      <div>
                        <h3 className="font-semibold capitalize">{mealType}</h3>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {groupedEntries[mealType].length} items
                        </p>
                      </div>
                    </div>

                    {/* Calories */}
                    <p className="font-bold">{mealCalories} kcal</p>
                  </div>

                  <div className="space-y-3">
                    {groupedEntries[mealType].map((food) => (
                      <div
                        key={food.id}
                        className="food-entry-item"
                      >
                        <p>{food.name}</p>

                        <div className="flex items-center gap-4">
                          <span>{food.calories} kcal</span>

                          <button
                            onClick={() => handleDelete(food.documentId)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLog;
