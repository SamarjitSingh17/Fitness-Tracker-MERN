import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  PersonStanding,
  ScaleIcon,
  Target,
  User,
} from "lucide-react";
import Input from "../components/ui/Input";
import AppContext from "../context/AppContext";
import Button from "../components/ui/Button";
import { ageRanges, goalOptions } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Slider from "../components/ui/Slider";
import api from "../config/api";
// .onboarding-container {
//   @apply min-h-screen bg-linear-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 flex flex-col transition-colors duration-200;
// }

// .onboarding-wrapper {
//   @apply w-full lg:max-w-5xl mx-auto;
// }

// .onboarding-option-btn {
//   @apply w-full p-3 pl-5 rounded-xl border text-left border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer;
// }

/*
export const goalOptions = [
    { value: "lose", label: "Lose Weight" },
    { value: "maintain", label: "Maintain Weight" },
    { value: "gain", label: "Gain Muscle" },
];

export const ageRanges = [
    { max: 15, maintain: 2500, burn: 600 },
    { max: 18, maintain: 2550, burn: 600 },
    { max: 21, maintain: 2500, burn: 550 },
    { max: 24, maintain: 2450, burn: 550 },
    { max: 27, maintain: 2400, burn: 525 },
     ....]
*/

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, setOnboardingCompleted, fetchUser } = useContext(AppContext);

  const [formData, setFormData] = useState({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });

  const totalSteps = 3;

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = async () => {
    if (step == 1) {
      if (!formData.age || formData.age < 13 || formData.age > 100) {
        return toast.error("Please Enter Age first");
      }
    }
    if (step == 2) {
      if (!formData.weight) {
        return toast.error("Please Enter Weight first");
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const userData = {
        ...formData,
        age: formData.age,
        weight: formData.weight,
        height: formData.height ? formData.height : null,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("fitnessUser", JSON.stringify(userData));
      try {
        await api.put(`/api/users/${user.id}`, userData);
        toast.success("Profile Updated Successfully!");
        setOnboardingCompleted(true);
        fetchUser(user?.token || "");
      } catch (error) {
        console.log(error.message);
        toast.error(error.message);
      }
      navigate("/");
    }
  };

  return (
    <>
      {/* outer container */}
      <div className="onboarding-container">
        {/* Header */}
        <div className="onboarding-wrapper p-6 pt-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <PersonStanding className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl  font-bold text-slate-800 dark:text-white">
              Fit Tracker
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Let's Personalize your experience
          </p>
        </div>
        {/*  */}
        {/* Progress indicator */}
        <div className="onboarding-wrapper px-6 mb-8">
          <div className="flex gap-2 max-w-2xl">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Step {step} of {totalSteps}
          </p>
        </div>
        {/*  */}
        {/* Form content */}
        <div className="onboarding-wrapper flex-1 px-6">
          {/* step1 */}
          {step === 1 && (
            // outer div
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <User className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    How old are you?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This helps us to calculate your needs.
                  </p>
                </div>
              </div>
              {/* input component */}
              <Input
                label="Age"
                type="number"
                value={formData.age}
                className="max-w-2xl"
                onChange={(v) => updateField("age", v)}
                placeholder="Enter Your Age"
                min={13}
                max={100}
                required
              />
            </div>
          )}

          {/* step 2 */}
          {step === 2 && (
            // outer div
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <ScaleIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Your Measurements
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Help us to track your progress
                  </p>
                </div>
              </div>
              {/* input component */}
              <div className="flex flex-col gap-4 wax-w-2xl">
                <Input
                  label="Weight(kg)"
                  type="number"
                  value={formData.weight}
                  className="max-w-2xl"
                  onChange={(v) => updateField("weight", v)}
                  placeholder="Enter Your Weight"
                  min={20}
                  max={300}
                  required
                />
                <Input
                  label="Height(cm)-Optional"
                  type="number"
                  value={formData.height}
                  className="max-w-2xl"
                  onChange={(v) => updateField("height", v)}
                  placeholder="Enter Your Height"
                  min={100}
                  max={250}
                />
              </div>
            </div>
          )}
          {/* step3 */}

          {step === 3 && (
            // outer div
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-emerald-500 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
                  <Target className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    What's Your Goal?
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    We'll tailor your experience
                  </p>
                </div>
              </div>
              {/* input component */}
              {/* select goal */}
              <div className="space-y-4 max-w-lg">
                {goalOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      const age = Number(formData.age);
                      const range = ageRanges.find(
                        (r) => age <= r.max || ageRanges[ageRanges.length - 1],
                      );
                      let maintain = range.maintain;
                      let burn = range.burn;
                      if (option.value === "lose") {
                        maintain -= 400;
                        burn += 100;
                      } else if (option.value === "gain") {
                        maintain += 500;
                        burn -= 100;
                      }
                      setFormData({
                        ...formData,
                        goal: option.value,
                        dailyCalorieIntake: maintain,
                        dailyCalorieBurn: burn,
                      });
                    }}
                    className={`onboarding-option-btn ${formData.goal === option.value && "ring-2 ring-emerald-500"}`}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              {/* separtor line */}
              <div className="border-t dark:border-slate-200 border-slate-800 my-6 max-w-lg " />
              {/* Daily targets */}
              <div className="space-y-6 max-w-lg">
                <Slider
                  label="Daily Calorie Intake"
                  min={120}
                  max={4000}
                  step={50}
                  value={formData.dailyCalorieIntake}
                  onChange={(v) => updateField("dailyCalorieIntake", v)}
                  unit="Kcal"
                  infoText={"Total Calories You plan to consume each day"}
                />
                <Slider
                  label="Daily Calorie Burn"
                  min={120}
                  max={4000}
                  step={50}
                  value={formData.dailyCalorieBurn}
                  onChange={(v) => updateField("dailyCalorieBurn", v)}
                  unit="Kcal"
                  infoText={"Total Calories You plan to burn each day"}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigate buttons */}
        <div className="onboarding-wrapper p-6 pb-10">
          <div className="flex gap-3 lg:justify-end">
            {step > 1 && (
              <Button
                variant="secondary"
                className="max-lg:flex-1 lg:px-10"
                onClick={() => setStep(step > 1 ? step - 1 : 1)}
              >
                <span className="flex items-center justify-center">
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </span>
              </Button>
            )}
            <Button className="max-lg:flex-1 lg:px-10" onClick={handleNext}>
              <span className="flex items-center justify-center">
                {step == 3 ? "Get Started" : "Continue"}
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
