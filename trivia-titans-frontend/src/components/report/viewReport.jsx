import React, { useState,useEffect } from "react";
import Iframe from "react-iframe";

const Report = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const report1Url = "https://lookerstudio.google.com/embed/reporting/7b957811-47d9-4cc7-9a1c-7cc78ae8d72b/page/vsbYD";
  const report2Url = "https://lookerstudio.google.com/embed/reporting/f73e0076-a452-476f-b649-ebdfac92de60/page/0tbYD";

  const handleReportChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedReport(selectedValue);
  };

  const defaultReport = () => {
    setSelectedReport(report1Url);
  }
  useEffect(() => {
    defaultReport();
  }, [] )

  return (
    <div>
      <h1>Trivia Reports</h1>
      <select onChange={handleReportChange}>
        <option value={report1Url}>Team Reports</option>
        <option value={report2Url}>User Reports</option>
      </select><br />
      {selectedReport && <Iframe url={selectedReport} width="80%" height="400px" />}
    </div>
  );
};

export default Report;