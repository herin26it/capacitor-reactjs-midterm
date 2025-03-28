import { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import html2canvas from "html2canvas";
import "./index.css";

const App = () => {
  const [time, setTime] = useState("");

  const getCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setTime(formattedTime);
  };

  const sendNotification = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Thời gian hiện tại",
          body: `Bây giờ là: ${time}`,
          schedule: { at: new Date(Date.now() + 1000) },
        },
      ],
    });
  };

  const shareTime = async () => {
    await Share.share({
      title: "Chia sẻ thời gian",
      text: `Bây giờ là: ${time}`,
      dialogTitle: "Chia sẻ qua ứng dụng khác",
    });
  };

  const captureScreen = async () => {
    const element = document.getElementById("app-container");
    if (!element) return;

    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL("image/png");

    await Filesystem.writeFile({
      path: `screenshot-${Date.now()}.png`,
      data: dataUrl.split(",")[1],
      directory: Directory.Documents,
    });

    alert("Ảnh chụp màn hình đã được lưu!");
  };

  return (
    <div id="app-container" className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5">
      <h1 className="text-3xl font-bold mb-6">Hiển thị thời gian</h1>
      <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-6 w-80 text-center">
        <h2 className="text-2xl font-semibold mb-4">{time || "--:--:--"}</h2>
        <button className="btn" onClick={getCurrentTime}>Lấy thời gian hiện tại</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="btn" onClick={sendNotification}>Gửi thông báo</button>
        <button className="btn" onClick={shareTime}>Chia sẻ</button>
        <button className="btn col-span-2" onClick={captureScreen}>Chụp màn hình</button>
      </div>
    </div>
  );
};

export default App;