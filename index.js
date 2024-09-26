let selectedColorBox = null;
// document ready
document.addEventListener("DOMContentLoaded", function () {
  // set chart_title_div textContent to the value of chartTitle input
  document.getElementById("chart_title_div").textContent =
    document.getElementById("chartTitle").value;
  // listen to chartTitle input and update the chart title
  document.getElementById("chartTitle").addEventListener("input", function () {
    // update the h2 inside the div with id 'chart_title'
    document.getElementById("chart_title_div").textContent = this.value;
  });

  // load the default colors from localStorage
  const savedColors = localStorage.getItem("levelColors");
  console.log("savedColors", savedColors);

  if (savedColors) {
    console.log("JSON.parse(savedColors)", JSON.parse(savedColors));
    levelColors = JSON.parse(savedColors);
  } else {
    levelColors = [
      "#3498db",
      "#2ecc71",
      "#e74c3c",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
    ];
  }
  // populate the colorList with the saved colors
  const colorList = document.getElementById("colorList");
  levelColors.forEach((color) => {
    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = color;
    colorBox.onclick = function () {
      selectColor(this);
    };
    colorList.appendChild(colorBox);
  });
  chartData = convertFromDataToChart(exampleData.slice(1));
  updateChartColor();

  google.charts.load("current", { packages: ["orgchart"] });
  google.charts.setOnLoadCallback(drawChart);
  // hide update and remove buttons
  document.getElementById("updateColor").style.display = "none";
  document.getElementById("removeColor").style.display = "none";
});
function updateLocalstorageColors() {
  localStorage.setItem("levelColors", JSON.stringify(levelColors));
}
function deselectColor() {
  if (selectedColorBox) {
    selectedColorBox.innerHTML = ""; // Clear previous icon
    selectedColorBox.style.border = ""; // Remove the border
    selectedColorBox = null; // Clear selection
    updateLocalstorageColors();
  }
}
function selectColor(element) {
  const highlightAmber = "#f39c12"; // Amber color for highlighting

  if (selectedColorBox === element) {
    // If the same color box is clicked again, deselect it
    deselectColor();
    toggleUpdateRemoveColorButtons();
    return;
  }

  if (selectedColorBox) {
    selectedColorBox.style.border = ""; // Remove the border from the previously selected color
    // remove check icon
    selectedColorBox.innerHTML = "";
  }

  selectedColorBox = element; // Update the selected color box

  // Create and append a check icon to the currently selected color
  const checkIcon = document.createElement("span");
  checkIcon.innerHTML = "&#10003;"; // Unicode check mark
  checkIcon.style.fontSize = "16px";
  checkIcon.style.position = "absolute";
  checkIcon.style.top = "-15px"; // Position the check icon above the color box
  checkIcon.style.left = "50%";
  checkIcon.style.color = highlightAmber;
  checkIcon.style.transform = "translate(-50%, -50%)";
  selectedColorBox.style.position = "relative"; // Ensure the parent is positioned
  selectedColorBox.appendChild(checkIcon);
  const currentSelectedColor = selectedColorBox.style.backgroundColor;
  // make the color  bigger in radius
  selectedColorBox.style.border = `4px solid ${currentSelectedColor}`;
  toggleUpdateRemoveColorButtons();
}
function updateColor() {
  if (selectedColorBox) {
    const colorPicker = document.getElementById("colorPicker");
    // if the color already exists in the list, do not add it again
    if (levelColors.includes(colorPicker.value)) {
      alert("此顏色已存在於列表中");
      return;
    }
    selectedColorBox.style.backgroundColor = colorPicker.value;
    const index = Array.from(selectedColorBox.parentNode.children).indexOf(
      selectedColorBox
    );
    levelColors[index] = colorPicker.value;
    updateChartColor();

    drawChart();
    deselectColor();
    updateLocalstorageColors();
  } else {
    alert("請先選擇要修改的顏色");
  }
  toggleUpdateRemoveColorButtons();
}
function addColor() {
  const colorPicker = document.getElementById("colorPicker");
  const newColor = colorPicker.value;
  const colorList = document.getElementById("colorList");
  // if the color already exists in the list, do not add it again
  if (levelColors.includes(newColor)) {
    alert("此顏色已存在於列表中");
    return;
  }
  const newColorBox = document.createElement("div");
  newColorBox.className = "color-box";
  newColorBox.style.backgroundColor = newColor;
  newColorBox.onclick = function () {
    selectColor(this);
  };

  colorList.appendChild(newColorBox);
  levelColors.push(newColor);
  updateChartColor();
  drawChart();
  updateLocalstorageColors();
  toggleUpdateRemoveColorButtons();
}
function removeColor() {
  if (selectedColorBox) {
    const index = Array.from(selectedColorBox.parentNode.children).indexOf(
      selectedColorBox
    );
    levelColors.splice(index, 1);
    selectedColorBox.remove();
    selectedColorBox = null; // Clear selection after removal
    updateChartColor();

    drawChart();
    deselectColor();

    updateLocalstorageColors();
    toggleUpdateRemoveColorButtons();
  } else {
    alert("請先選擇要移除的顏色");
  }
}
function toggleUpdateRemoveColorButtons() {
  const updateColorButton = document.getElementById("updateColor");
  const removeColorButton = document.getElementById("removeColor");
  if (selectedColorBox) {
    updateColorButton.style.display = "block";
    removeColorButton.style.display = "block";
  } else {
    updateColorButton.style.display = "none";
    removeColorButton.style.display = "none";
  }
}
let levelColors = [];
let exampleData = [
  ["員工編號", "員工", "職位", "主管編號", "主管", "說明"],
  ["A0001", "Mike", "首席執行官", "", "", "首席執行官"],
  ["A0002", "Jim", "首席營運官", "A0001", "Mike", "首席營運官"],
  ["A0003", "Alice", "首席財務官", "A0001", "Mike", "首席財務官"],
  ["A0004", "Bob", "首席技術官", "A0001", "Mike", "首席技術官"],
  ["A0005", "Carol", "人力資源總監", "A0002", "Jim", "人力資源總監"],
  ["A0006", "David", "行銷總監", "A0002", "Jim", "行銷總監"],
  ["A0007", "Eve", "財務控制師", "A0003", "Alice", "財務控制師"],
  ["A0008", "Frank", "市場經理", "A0006", "David", "市場經理"],
  ["A0009", "Grace", "品牌經理", "A0006", "David", "品牌經理"],
  ["A0010", "Helen", "市場專員", "A0008", "Frank", "市場專員"],
  ["A0011", "Ivy", "品牌專員", "A0009", "Grace", "品牌專員"],
  ["A0012", "Jack", "市場助理", "A0010", "Helen", "市場助理"],
  ["A0013", "Kelly", "品牌助理", "A0011", "Ivy", "品牌助理"],
  ["A0014", "Lily", "市場實習生", "A0012", "Jack", "市場實習生"],
];
let chartData;
let chart;
let data;
let options;
function updateChartColor() {
  //TODO: Add Employee IDs
  const output = chartData.map(([person, supervisor, tooltip]) => [
    person.v, // Extract the name
    person.f.split("<br/>")[1].replace("</div>", ""), // Extract the position
    supervisor || "", // Supervisor (use an empty string if none)
    tooltip, // Use the position as Tooltip for now (can adjust later if needed)
  ]);

  // Add the header row manually
  //TODO: Add Employee IDs
  output.unshift(["員工編號", "員工顯示名稱", "職位", "主管編號", "主管顯示名稱", "額外說明"]);
  console.log("chartData in updateChartColor", chartData);
  console.log("output in updateChartColor", output);
  chartData = output.slice(1).map((row) => {
    const [name, role, manager, tooltip] = row;
    const level = getLevel(manager, output.slice(1));
    const color = levelColors[level % levelColors.length];
    return [
      {
        v: name,
        f: chartNodeHtml(name, role, color, tooltip),
      },
      manager,
      tooltip,
    ];
  });
}
function chartNodeHtml(name, role, color, tooltip) {
  return `
    <div style="background-color:${color}; color:white; padding:5px; border-radius:5px; font-family: 'Microsoft JhengHei';">
      <strong>${name}</strong><br/>
      ${role}<br/>
      ${tooltip ? `<div style="font-size:10px; ">${tooltip}</div>` : ''}
    </div>
  `;
}

function convertFromDataToChart(data) {
  console.log("data in convertFromDataToChart", data);
  return data.map((row) => {
    const [employeeId, name, role, managerId, manager, tooltip] = row;
    const managerDisplayedText = managerId === "" ? "" : manager + "(" + managerId + ")";
    const level = getLevel(managerDisplayedText, data);
    const color = levelColors[level % levelColors.length];
    return [
      {
        v: name + "(" + employeeId + ")",
        f: chartNodeHtml(name, role, color, tooltip),
      },
      managerDisplayedText,
      tooltip,
    ];
  });
}
function drawChart() {
  // update chartData background-color based on level
  data = new google.visualization.DataTable();
  data.addColumn("string", "Name");
  data.addColumn("string", "Manager");
  data.addColumn("string", "ToolTip");

  data.addRows(chartData);

  chart = new google.visualization.OrgChart(
    document.getElementById("chart_div")
  );

  options = {
    allowHtml: true,
    size: "medium",
    nodeClass: "node",
    selectedNodeClass: "selected-node",
    color: "#fff",
    backgroundColor: "transparent",
    compactRows: true,
  };
  chart.draw(data, options);
}

function printChart() {
  const chartDiv = document.getElementById("chart_div");
  // Select the whole table element
  const table = chartDiv.querySelector(".google-visualization-orgchart-table");
  // Clone the table to avoid modifying the original element
  const clone = table.cloneNode(true);
  // Add the title to the cloned table
  const title = document.getElementById("chartTitle").value;
  // Wrap the title in a div element with styling
  const titleDiv = document.createElement("div");
  titleDiv.style.textAlign = "center";
  titleDiv.style.fontSize = "20px";
  titleDiv.style.fontWeight = "bold";
  titleDiv.style.marginBottom = "20px";
  titleDiv.textContent = title;
  // Create a container to center the title and table
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.appendChild(titleDiv);
  container.appendChild(clone);
  // Append the container to the body
  document.body.appendChild(container);

  // Get the dimensions of A4 landscape
  const a4WidthInMm = 297; // A4 landscape width in mm
  // pixel to mm ratio
  const pixelToMm = 0.264583;
  // // Get the original table dimensions
  const tableWidth = clone.offsetWidth * pixelToMm; // Width in pixels
  const tableHeight = clone.offsetHeight * pixelToMm; // Height in pixels
  // // Calculate scaling factors to fit the table within the A4 dimensions
  const scaleX = a4WidthInMm / tableWidth; // Convert pixels to mm (1 px = 0.264583 mm)

  console.log(
    "a4WidthInMm",
    a4WidthInMm,
    "tableWidth",
    tableWidth,
    "tableHeight",
    tableHeight,
    "scaleX",
    scaleX
  );
  // Create PDF options for html2pdf
  const opt = {
    margin: [10, 10], // Set margins (top, left, bottom, right) in mm
    filename: "org_chart.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 4, allowTaint: true },
    jsPDF: {
      unit: "mm",
      format: [tableWidth + 50, tableHeight + 50],
      orientation: "landscape",
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
    },
  };

  // Generate the PDF from the resized clone
  html2pdf()
    .from(container)
    .set(opt)
    .save()
    .then(() => {
      // Clean up by removing the clone after the PDF is generated
      document.body.removeChild(container);
    });
}

function handleFileUpload(event) {
  try {
    const file = event.target.files[0];

    // Ensure the uploaded file is in .xlsx format
    if (
      !file ||
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please upload a valid Excel (.xlsx) file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the data is in the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert worksheet to JSON
      const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("results", results);
      chartData = convertFromDataToChart(results.slice(1));
      updateChartColor();
      drawChart();
    };

    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.log(error);
  }
}

function getLevel(manager, data) {
  if (!manager) return 0;

  let level = 0;
  let currentManager = manager;
  const visited = new Set(); // To track visited managers

  while (currentManager) {
    if (visited.has(currentManager)) {
      // pop up message
      console.error(
        "Infinite loop detected. Circular hierarchy found." + currentManager
      );
      break; // Break the loop if we revisit the same manager
    }

    visited.add(currentManager); // Mark current manager as visited
    const managerData = data.find((row) => row[0] === currentManager);

    if (managerData) {
      currentManager = managerData[2];
      level++;
    } else {
      break;
    }
  }
  return level;
}

function downloadTemplate() {
  // Define the data for the Excel file
  const data = [
    ["員工編號", "員工", "職位", "主管編號", "主管", "說明"],
    ["A0001", "羅波特", "CEO", "", "", "首席執行官"],
    ["A0002", "米雪兒", "COO", "A0001", "羅波特", "首席營運官"],
    ["A0003", "李明", "CTO", "A0001", "羅波特", "首席技術官"],
    ["A0004", "張華", "CFO", "A0001", "羅波特", "首席財務官"],
    ["A0005", "小林", "人力資源經理", "A0002", "米雪兒", "負責招聘和培訓"],
    ["A0006", "大衛", "行銷經理", "A0002", "米雪兒", "負責市場推廣與品牌管理"],
    ["A0007", "小美", "市場專員", "A0006", "大衛", "負責社交媒體和廣告"],
    ["A0008", "艾莉莎", "銷售經理", "A0006", "大衛", "負責銷售團隊的管理"],
    ["A0009", "凱莉", "業務代表", "A0008", "艾莉莎", "負責客戶拜訪和需求收集"],
    ["A0010", "施密特", "財務分析師", "A0004", "張華", "負責財務報告與分析"],
    ["A0011", "陳冠宇", "會計經理", "A0004", "張華", "負責公司的會計事務"],
    ["A0012", "錢小芳", "初級會計", "A0011", "陳冠宇", "負責日常賬目處理"],
    ["A0013", "方敏", "技術經理", "A0003", "李明", "負責技術團隊的管理"],
    ["A0014", "潔西卡", "產品經理", "A0003", "李明", "負責產品策略與開發"],
    ["A0015", "明莉", "開發經理", "A0013", "方敏", "負責開發團隊的管理"],
    ["A0016", "小紅", "前端開發人員", "A0015", "明莉", "負責網站的前端開發"],
    ["A0017", "小藍", "後端開發人員", "A0015", "明莉", "負責網站的後端開發"],
    ["A0018", "史密斯", "資訊安全專家", "A0003", "李明", "負責公司的資訊安全"],
    [
      "A0019",
      "小華",
      "IT支援專員",
      "A0018",
      "史密斯",
      "負責技術支援與系統管理",
    ],
    [
      "A0020",
      "凱薩",
      "企業發展經理",
      "A0001",
      "羅波特",
      "負責商業拓展和策略規劃",
    ],
    ["A0021", "羅莉", "公共關係經理", "A0020", "凱薩", "負責公司與媒體的關係"],
    [
      "A0022",
      "希拉",
      "社交媒體經理",
      "A0006",
      "大衛",
      "負責社交媒體策略與執行",
    ],
    ["A0023", "阿東", "培訓專員", "A0005", "小林", "負責員工培訓計畫"],
    ["A0024", "小玲", "內部培訓講師", "A0023", "阿東", "負責提供培訓課程"],
    [
      "A0025",
      "大米",
      "客戶服務經理",
      "A0002",
      "米雪兒",
      "負責客戶支持和滿意度",
    ],
    ["A0026", "喬安", "客戶支持專員", "A0025", "大米", "負責解答客戶疑問"],
    ["A0027", "小強", "數據科學家", "A0003", "李明", "負責數據分析與報告"],
    [
      "A0028",
      "小白",
      "資料分析專員",
      "A0027",
      "小強",
      "負責數據清理與初步分析",
    ],
    ["A0029", "瑪莉", "品質保證經理", "A0014", "潔西卡", "負責產品品質的監控"],
    ["A0030", "小灰", "測試工程師", "A0029", "瑪莉", "負責產品測試與缺陷報告"],
    ["A0031", "澳里歐", "測試人員", "A0016", "小紅", ""],
    ["A0032", "貓傻立", "測試檢測人員", "A0031", "澳里歐", ""],
    ["A0033", "法蘭克", "監控人員", "A0032", "貓傻立", ""],
    ["A0034", "雄寶北", "監督", "A0033", "法蘭克", ""],
  ];

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the data array to a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "OrgChart");

  // Write the workbook to a file
  XLSX.writeFile(workbook, "org_chart_template.xlsx");
}
