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
});
function deselectColor() {
  if (selectedColorBox) {
    selectedColorBox.innerHTML = ""; // Clear previous icon
    selectedColorBox.style.border = ""; // Remove the border
    selectedColorBox = null; // Clear selection
  }
}
function selectColor(element) {
  const highlightAmber = "#f39c12"; // Amber color for highlighting
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
  } else {
    alert("請先選擇要修改的顏色");
  }
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
  } else {
    alert("請先選擇要移除的顏色");
  }
}
google.charts.load("current", { packages: ["orgchart"] });
google.charts.setOnLoadCallback(drawChart);

const levelColors = [
  "#3498db",
  "#2ecc71",
  "#e74c3c",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
];
let exampleData = [
  ["Mike", "首席執行官", "", "首席執行官"],
  ["Jim", "首席營運官", "Mike", "首席營運官"],
  ["Alice", "首席財務官", "Mike", "首席財務官"],
  ["Bob", "首席技術官", "Mike", "首席技術官"],
  ["Carol", "人力資源總監", "Jim", "人力資源總監"],
  ["David", "行銷總監", "Jim", "行銷總監"],
  ["Eve", "財務控制師", "Alice", "財務控制師"],
  ["Frank", "市場經理", "David", "市場經理"],
  ["Grace", "品牌經理", "David", "品牌經理"],
  ["Helen", "市場專員", "Frank", "市場專員"],
  ["Ivy", "品牌專員", "Grace", "品牌專員"],
  ["Jack", "市場助理", "Helen", "市場助理"],
  ["Kelly", "品牌助理", "Ivy", "品牌助理"],
  ["Lily", "市場實習生", "Jack", "市場實習生"],
];
let chartData = convertFromDataToChart(exampleData);
let chart;
let data;
let options;
function updateChartColor() {
  const output = chartData.map(([person, supervisor, tooltip]) => [
    person.v, // Extract the name
    person.f.split("<br/>")[1].replace("</div>", ""), // Extract the position
    supervisor || "", // Supervisor (use an empty string if none)
    tooltip, // Use the position as Tooltip for now (can adjust later if needed)
  ]);

  // Add the header row manually
  output.unshift(["名稱", "職位", "主管", "Tooltip"]);
  chartData = output.slice(1).map((row) => {
    const [name, role, manager, tooltip] = row;
    const level = getLevel(manager, output.slice(1));
    const color = levelColors[level % levelColors.length];
    return [
      {
        v: name,
        f: chartNodeHtml(name, role, color),
      },
      manager,
      tooltip,
    ];
  });
}
function chartNodeHtml(name, role, color) {
  return `<div style="background-color:${color}; color:white; padding:5px; border-radius:5px; font-family: 'Microsoft JhengHei';"><strong>${name}</strong><br/>${role}</div>`;
}
function convertFromDataToChart(data) {
  return data.map((row) => {
    const [name, role, manager, tooltip] = row;
    const level = getLevel(manager, data);
    const color = levelColors[level % levelColors.length];
    return [
      {
        v: name,
        f: chartNodeHtml(name, role, color),
      },
      manager,
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
      chartData = results.slice(1).map((row) => {
        const [name, role, manager, tooltip] = row;
        const level = getLevel(manager, results.slice(1));
        const color = levelColors[level % levelColors.length];
        return [
          {
            v: name,
            f: `<div style="background-color:${color}; color:white; padding:5px; border-radius:5px; font-family: 'Microsoft JhengHei';"><strong>${name}</strong><br/>${role}</div>`,
          },
          manager,
          tooltip,
        ];
      });

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
    ["名稱", "職位", "主管", "Tooltip"],
    ["羅波特", "CEO", "", "首席執行官"],
    ["米雪兒", "COO", "羅波特", "首席營運官"],
    ["李明", "CTO", "羅波特", "首席技術官"],
    ["張華", "CFO", "羅波特", "首席財務官"],
    ["小林", "人力資源經理", "米雪兒", "負責招聘和培訓"],
    ["大衛", "行銷經理", "米雪兒", "負責市場推廣與品牌管理"],
    ["小美", "市場專員", "大衛", "負責社交媒體和廣告"],
    ["艾莉莎", "銷售經理", "大衛", "負責銷售團隊的管理"],
    ["凱莉", "業務代表", "艾莉莎", "負責客戶拜訪和需求收集"],
    ["施密特", "財務分析師", "張華", "負責財務報告與分析"],
    ["陳冠宇", "會計經理", "張華", "負責公司的會計事務"],
    ["錢小芳", "初級會計", "陳冠宇", "負責日常賬目處理"],
    ["方敏", "技術經理", "李明", "負責技術團隊的管理"],
    ["潔西卡", "產品經理", "李明", "負責產品策略與開發"],
    ["明莉", "開發經理", "方敏", "負責開發團隊的管理"],
    ["小紅", "前端開發人員", "明莉", "負責網站的前端開發"],
    ["小藍", "後端開發人員", "明莉", "負責網站的後端開發"],
    ["史密斯", "資訊安全專家", "李明", "負責公司的資訊安全"],
    ["小華", "IT支援專員", "史密斯", "負責技術支援與系統管理"],
    ["凱薩", "企業發展經理", "羅波特", "負責商業拓展和策略規劃"],
    ["羅莉", "公共關係經理", "凱薩", "負責公司與媒體的關係"],
    ["希拉", "社交媒體經理", "大衛", "負責社交媒體策略與執行"],
    ["阿東", "培訓專員", "小林", "負責員工培訓計畫"],
    ["小玲", "內部培訓講師", "阿東", "負責提供培訓課程"],
    ["大米", "客戶服務經理", "米雪兒", "負責客戶支持和滿意度"],
    ["喬安", "客戶支持專員", "大米", "負責解答客戶疑問"],
    ["小強", "數據科學家", "李明", "負責數據分析與報告"],
    ["小白", "資料分析專員", "小強", "負責數據清理與初步分析"],
    ["瑪莉", "品質保證經理", "潔西卡", "負責產品品質的監控"],
    ["小灰", "測試工程師", "瑪莉", "負責產品測試與缺陷報告"],
    ["澳里歐", "測試人員", "小紅", ""],
    ["貓傻立", "測試檢測人員", "澳里歐", ""],
    ["法蘭克", "監控人員", "貓傻立", ""],
    ["雄寶北", "監督", "法蘭克", ""],
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
