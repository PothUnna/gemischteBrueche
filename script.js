    function polarToCartesian(cx, cy, r, angleDeg) {
      const angleRad = (angleDeg - 90) * Math.PI / 180;
      return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
      };
    }

    function describeSector(cx, cy, r, startAngle, endAngle) {
      const start = polarToCartesian(cx, cy, r, endAngle);
      const end = polarToCartesian(cx, cy, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M", cx, cy,
        "L", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    }

    function createPieSVG(denominator, filledParts) {
      const size = 95;
      const cx = 47.5;
      const cy = 47.5;
      const r = 38;
      const svgNS = "http://www.w3.org/2000/svg";

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 95 95");
      svg.setAttribute("class", "pie");

      for (let i = 0; i < denominator; i++) {
        const start = (360 / denominator) * i;
        const end = (360 / denominator) * (i + 1);

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", describeSector(cx, cy, r, start, end));
        path.setAttribute("fill", i < filledParts ? "#f59e0b" : "#ffffff");
        path.setAttribute("stroke", "#334155");
        path.setAttribute("stroke-width", "1.5");
        svg.appendChild(path);
      }

      const circleOutline = document.createElementNS(svgNS, "circle");
      circleOutline.setAttribute("cx", cx);
      circleOutline.setAttribute("cy", cy);
      circleOutline.setAttribute("r", r);
      circleOutline.setAttribute("fill", "none");
      circleOutline.setAttribute("stroke", "#334155");
      circleOutline.setAttribute("stroke-width", "2");
      svg.appendChild(circleOutline);

      return svg;
    }

    function renderVisual(containerId, numerator, denominator) {
      const container = document.getElementById(containerId);
      container.innerHTML = "";

      const wholeCount = Math.floor(numerator / denominator);
      const rest = numerator % denominator;

      for (let i = 0; i < wholeCount; i++) {
        container.appendChild(createPieSVG(denominator, denominator));
      }

      if (rest > 0) {
        container.appendChild(createPieSVG(denominator, rest));
      }
    }

    renderVisual("exampleA", 5, 4);
    renderVisual("exampleB", 13, 4);
    renderVisual("exampleC", 7, 3);

    const exercises = [
      { id: 1, numerator: 11, denominator: 4},
      { id: 2, numerator: 8, denominator: 3},
      { id: 3, numerator: 10, denominator: 4},
      { id: 4, numerator: 9, denominator: 5},
      { id: 5, numerator: 17, denominator: 6 },
      { id: 6, numerator: 23, denominator: 8 },
      { id: 7, numerator: 15, denominator: 7 },
      { id: 8, numerator: 37, denominator: 12 },
      { id: 9, numerator: 26, denominator: 9 }
    ];

    const exerciseContainer = document.getElementById("exerciseContainer");

    exercises.forEach(ex => {
      const wrapper = document.createElement("div");
      wrapper.className = "exercise";

      wrapper.innerHTML = `
        <div class="exercise-header">
          <div class="exercise-title">Aufgabe ${ex.id}</div>
          <div class="mini-note">Schreibe zum Bild den unechten und den gemischten Bruch auf.</div>
        </div>

        <div class="visual-row" id="visual-${ex.id}"></div>

        <div class="input-grid">
          <div class="input-block">
            <label>Unechter Bruch</label>
            <div class="fraction-input">
              <div class="stack">
                <input type="number" id="u-num-${ex.id}" min="0" />
                <div class="line"></div>
                <input type="number" id="u-den-${ex.id}" min="1" />
              </div>
            </div>
          </div>

          <div class="input-block">
            <label>Gemischter Bruch</label>
            <div class="fraction-input">
              <input type="number" id="m-whole-${ex.id}" min="0" />
              <div class="stack">
                <input type="number" id="m-num-${ex.id}" min="0" />
                <div class="line"></div>
                <input type="number" id="m-den-${ex.id}" min="1" />
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:14px;">
          <button onclick="checkExercise(${ex.id})">Überprüfen</button>
        </div>

        <div class="result" id="result-${ex.id}"></div>
      `;

      exerciseContainer.appendChild(wrapper);
      renderVisual(`visual-${ex.id}`, ex.numerator, ex.denominator);
    });

    function value(id) {
      return Number(document.getElementById(id).value);
    }

    function checkExercise(id) {
      const ex = exercises.find(e => e.id === id);

      const whole = Math.floor(ex.numerator / ex.denominator);
      const rest = ex.numerator % ex.denominator;
      const uNum = value(`u-num-${id}`);
      const uDen = value(`u-den-${id}`);
      const mWhole = value(`m-whole-${id}`);
      const mNum = value(`m-num-${id}`);
      const mDen = value(`m-den-${id}`);

      const resultBox = document.getElementById(`result-${id}`);

      const improperCorrect = (uNum === ex.numerator && uDen === ex.denominator);
      const mixedCorrect = (mWhole === whole && mNum === rest && mDen === ex.denominator);

      if (improperCorrect && mixedCorrect) {
        resultBox.className = "result success";
        resultBox.style.display = "block";
        resultBox.innerHTML = "Richtig! Sehr gut.";
      } else {
        resultBox.className = "result error";
        resultBox.style.display = "block";
        resultBox.innerHTML = "Noch nicht ganz richtig. Versuche es erneut!";
      }
    }
