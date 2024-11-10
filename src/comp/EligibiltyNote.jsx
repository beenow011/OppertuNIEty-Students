import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const EligibilityDisplay = ({ eligibilityNote }) => {
  // Extract percentage from eligibilityNote (assuming it’s in the format "Eligibility Percentage: 85%")
  const percentageMatch = eligibilityNote?.match(/(\d+)%/);
  const percentage = percentageMatch ? parseInt(percentageMatch[1], 10) : 0;

  return (
    <div className="flex items-center justify-center space-x-6 mt-6">
      {/* Circular progress bar for percentage */}
      <div className="w-20 h-20">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#E94560",
            pathColor: "#E94560",
            trailColor: "#f1f1f1",
            textSize: "16px",
          })}
        />
      </div>

      {/* Eligibility note */}
      {eligibilityNote && (
        <div className="bg-[#E94560] text-white p-4 rounded-lg shadow-md max-w-xs">
          <p className="text-lg font-semibold mb-2">Eligibility Note</p>
          <p className="text-sm">{eligibilityNote}</p>
        </div>
      )}
    </div>
  );
};

export default EligibilityDisplay;
