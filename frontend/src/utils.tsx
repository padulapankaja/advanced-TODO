export const getNotificationMessage = (
  type: "error" | "success" | "warning",
  message: string
) => {
  let bgColor, textColor;

  switch (type) {
    case "error":
      bgColor = "bg-red-50";
      textColor = "text-red-600";
      break;
    case "success":
      bgColor = "bg-green-200";
      textColor = "text-green-900";
      break;
    case "warning":
      bgColor = "bg-yellow-200";
      textColor = "text-yellow-900";
      break;
    default:
      bgColor = "";
      textColor = "";
  }

  return (
    <div className={`mb-4 p-3 ${bgColor} ${textColor} rounded-md`}>
      {message}
    </div>
  );
};
