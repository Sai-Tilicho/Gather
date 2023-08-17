import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { getDatabase, ref, child, get } from "firebase/database";

function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - oneJan) / 86400000);
  return Math.ceil((days + oneJan.getDay() + 1) / 7);
}

export default function WeeklySparkContentFetcher({ setSparkContent }) {
  useEffect(() => {
    const dbRef = ref(database);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeekNumber = getWeekNumber(currentDate);
    const weekSubpath = `${currentYear}-${String(currentWeekNumber).padStart(
      2,
      "0"
    )}`;

    get(child(dbRef, `/sparks/linker/global/weekly/${weekSubpath}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const sparkId = snapshot.val();

          const contentSnapshot = await get(
            child(dbRef, `/sparks/repo/${sparkId}`)
          );
          if (contentSnapshot.exists()) {
            setSparkContent(contentSnapshot.val().content);
          } else {
            console.log("Spark content not available for the current week");
          }
        } else {
          console.log("No sparkId available for the current week");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setSparkContent]);

  return null;
}
