import { useEffect, useState } from "react";

export function useMicrophonePermission() {
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt">(
    "prompt"
  );

  useEffect(() => {
    // Nếu browser không hỗ trợ
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermission("denied");
      return;
    }

    // Check quyền mic
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((result) => {
        setPermission(result.state as "granted" | "denied" | "prompt");

        // Nếu vẫn đang prompt, request quyền
        if (result.state === "prompt") {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => setPermission("granted"))
            .catch(() => setPermission("denied"));
        }

        // Lắng nghe khi user thay đổi quyền
        result.onchange = () => {
          setPermission(result.state as "granted" | "denied" | "prompt");
        };
      })
      .catch(() => {
        // Một số browser cũ không hỗ trợ navigator.permissions
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => setPermission("granted"))
          .catch(() => setPermission("denied"));
      });
  }, []);

  return permission;
}
