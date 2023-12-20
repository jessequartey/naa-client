"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const UpgradeButton = () => {
  return (
    <Button className="w-full">
      Upgrade now <ArrowRight className="ml-1.5 h-5 w-5" />
    </Button>
  );
};

export default UpgradeButton;
