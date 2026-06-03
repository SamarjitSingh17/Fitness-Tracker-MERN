import React from "react";
import { Loader2Icon } from "lucide-react";
const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-grau-50 bg-gray-900">
      <Loader2Icon className="h-8 w-8 animate-spin text-green-500" />
    </div>
  );
};

export default Loading;
