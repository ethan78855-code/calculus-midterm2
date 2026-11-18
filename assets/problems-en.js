/* 每一題的英文版題目與關鍵字對照。
   q     英文題目（依課本題意重寫，數字與問法相同；不是逐字照抄課本）。
         金額的錢字號寫成 [$]，由 app.js 換成不會被當成數學式的 $。
   terms 考卷上會看到的英文用語 → 中文（必要時加上它對應的數學動作）。
   page  課本（Tan, Applied Calculus 10e）紙本頁碼，方便翻書對照原文。 */
(function () {
  'use strict';
  var R = String.raw;

  var SKETCH_TERMS = [
    ['sketch the graph', '畫出圖形'],
    ['curve-sketching guide', '曲線描繪的流程（九個步驟）'],
    ['domain', '定義域'],
    ['intercepts', '截距'],
    ['vertical / horizontal asymptote', '垂直／水平漸近線'],
    ['increasing / decreasing', '遞增／遞減'],
    ['relative extrema', '相對極值'],
    ['concave upward / downward', '凹向上／凹向下'],
    ['inflection point', '反曲點']
  ];
  var IMPLICIT_TERMS = [
    ['find dy/dx', '求 dy/dx'],
    ['implicit differentiation', '隱函數微分（兩邊對 x 微分，看到 y 多乘 dy/dx）']
  ];
  var INCDEC_TERMS = [
    ['interval(s)', '區間（可能不只一段）'],
    ['increasing', '遞增（f′ > 0）'],
    ['decreasing', '遞減（f′ < 0）']
  ];
  var SDT_TERMS = [
    ['relative extrema', '相對極值（極大值和極小值的合稱）'],
    ['if any', '如果有的話'],
    ['Second Derivative Test', '二階導數檢定法（把臨界數代進 f″ 看正負）'],
    ['if applicable', '能用的話就用']
  ];

  window.CALC_EN = {
    /* ---------------- 3.4 ---------------- */
    '3.4-13': {
      page: 211,
      q: R`<p>A company sells its Pulsar 25 LED television at a wholesale unit price of $p$ dollars, and $x$ sets are demanded each week. The two quantities are related by</p>
$$p = 600 - 0.05x \qquad (0 \le x \le 12{,}000)$$
<p>Manufacturing $x$ sets in a week costs a total of</p>
$$C(x) = 0.000002x^3 - 0.03x^2 + 400x + 80{,}000$$
<p>dollars.</p>
<p>(a) Find the revenue function $R$ and the profit function $P$.<br>
(b) Find the marginal cost, marginal revenue, and marginal profit functions $C'$, $R'$, and $P'$.<br>
(c) Compute $C'(2000)$, $R'(2000)$, and $P'(2000)$, and interpret the results.<br>
(d) Sketch the graphs of $C$, $R$, and $P$, and use them to explain parts (b) and (c).</p>`,
      terms: [
        ['weekly demand', '每週需求'],
        ['wholesale unit price', '批發單價'],
        ['quantity demanded', '需求量'],
        ['total cost', '總成本'],
        ['revenue function', '收益函數（R = px）'],
        ['profit function', '利潤函數（P = R − C）'],
        ['marginal', '邊際（就是微分）'],
        ['compute', '計算'],
        ['interpret your results', '解釋結果的意義（要寫一句話）']
      ]
    },
    '3.4-15': {
      page: 211,
      q: R`<p>Use the total cost function of Exercise 13, $C(x) = 0.000002x^3 - 0.03x^2 + 400x + 80{,}000$.</p>
<p>(a) Find the average cost function $\bar{C}$.<br>
(b) Find the marginal average cost function $\bar{C}'$.<br>
(c) Compute $\bar{C}'(5000)$ and $\bar{C}'(10{,}000)$, and interpret the results.<br>
(d) Sketch the graph of $\bar{C}$.</p>`,
      terms: [
        ['refer to Exercise 13', '沿用第 13 題的函數'],
        ['average cost function', '平均成本函數（C̄ = C(x) ÷ x）'],
        ['marginal average cost function', '邊際平均成本函數（C̄ 的導數）'],
        ['interpret your results', '解釋結果的意義']
      ]
    },
    '3.4-37': {
      page: 212,
      q: R`<p>A video store rents DVDs at a price of $p$ dollars per disc. The number of discs rented per day, $x$ (in thousands), depends on the price through the demand equation</p>
$$x = \frac23\sqrt{36 - p^2} \qquad (0 \le p \le 6)$$
<p>The store now charges [$]2 per disc.</p>
<p>(a) At this rental price, is the demand elastic or inelastic?<br>
(b) If the store raises the rental price, will its revenue increase or decrease?</p>`,
      terms: [
        ['rental price', '租金'],
        ['quantity rented per day', '每天出租量'],
        ['demand equation', '需求方程式'],
        ['elasticity of demand', '需求彈性 E(p)'],
        ['elastic', '有彈性（E > 1）'],
        ['inelastic', '無彈性（E < 1）'],
        ['unitary', '單位彈性（E = 1）'],
        ['revenue', '收益']
      ]
    },

    /* ---------------- 3.5 ---------------- */
    '3.5-28': {
      page: 218,
      q: R`<p>Find the third derivative of the function.</p>
$$g(t) = \left(\tfrac12t^2 - 1\right)^5$$`,
      terms: [
        ['third derivative', '三階導數（微分三次，g‴）'],
        ['the given function', '題目給的函數']
      ]
    },

    /* ---------------- 3.6 ---------------- */
    '3.6-19': {
      page: 231,
      q: R`<p>Use implicit differentiation to find $\dfrac{dy}{dx}$.</p>
$$\sqrt{x + y} = x$$`,
      terms: IMPLICIT_TERMS
    },
    '3.6-23': {
      page: 231,
      q: R`<p>Use implicit differentiation to find $\dfrac{dy}{dx}$.</p>
$$\sqrt{xy} = x + y$$`,
      terms: IMPLICIT_TERMS
    },
    '3.6-34': {
      page: 231,
      q: R`<p>Find an equation of the tangent line to the curve at the given point.</p>
$$(x - y - 1)^3 = x; \qquad (1, -1)$$`,
      terms: [
        ['an equation of the tangent line', '切線方程式'],
        ['the graph of the function', '函數的圖形'],
        ['defined by the equation', '由這條方程式定義（y 沒有單獨解出來，是隱函數）'],
        ['at the indicated point', '在指定的點（後面括號裡的那個點）']
      ]
    },
    '3.6-44': {
      page: 231,
      q: R`<p>A brand of medium-sized eggs has wholesale price $p$ (in dollars per carton) and weekly supply $x$ (in thousands of cartons). They satisfy</p>
$$625p^2 - x^2 = 100$$
<p>One week begins with 25,000 cartons available, while the price is dropping by 2¢ per carton each week. How fast is the weekly supply falling at that time?</p>`,
      terms: [
        ['wholesale price', '批發價'],
        ['dollars per carton', '美元／盒'],
        ['weekly supply', '每週供給量'],
        ['in thousands of cartons', '單位是千盒（25,000 盒就是 x = 25）'],
        ['is falling at the rate of', '以…的速度下跌（變率是負的）'],
        ['2¢', '2 美分 = 0.02 美元'],
        ['at what rate', '多快（求變率 dx/dt）']
      ]
    },
    '3.6-49': {
      page: 232,
      q: R`<p>A country's output $Q$ (in billions of dollars) depends on $x$, the amount spent on labor, and $y$, the amount spent on capital (both in billions of dollars):</p>
$$Q = 20x^{3/5}y^{2/5}$$
<p>(a) What is the output when [$]32 billion goes to labor and [$]243 billion goes to capital?<br>
(b) The output must stay at the level found in (a). If spending on labor rises by [$]1 billion, by how much should spending on capital change? What is the MRTS?</p>`,
      terms: [
        ['output', '產出'],
        ['labor', '勞動'],
        ['capital', '資本'],
        ['billion', '十億'],
        ['is to be maintained at the level', '要維持在這個水準（Q 固定不變）'],
        ['by how much should … be changed', '應該改變多少（求 dy/dx）'],
        ['MRTS (marginal rate of technical substitution)', '邊際技術替代率（−dy/dx，寫正數）']
      ]
    },

    /* ---------------- 4.1 ---------------- */
    '4.1-34': {
      page: 265,
      q: R`<p>Find the intervals on which the function is increasing and the intervals on which it is decreasing.</p>
$$f(x) = \sqrt{16 - x^2}$$`,
      terms: INCDEC_TERMS
    },
    '4.1-35': {
      page: 265,
      q: R`<p>Find the intervals on which the function is increasing and the intervals on which it is decreasing.</p>
$$g(x) = x\sqrt{x + 1}$$`,
      terms: INCDEC_TERMS
    },
    '4.1-71': {
      page: 266,
      q: R`<p>Find the relative maxima and relative minima of the function, if there are any.</p>
$$g(x) = 2x^2 + \frac{4000}{x} + 10$$`,
      terms: [
        ['relative maxima', '相對極大值（maximum 的複數）'],
        ['relative minima', '相對極小值（minimum 的複數）'],
        ['if any', '如果有的話（沒有就寫 none）']
      ]
    },
    '4.1-84': {
      page: 267,
      q: R`<p>A company presses $x$ compact discs each week. Its average cost per disc, in dollars, is</p>
$$\bar{C}(x) = -0.0001x + 2 + \frac{2000}{x} \qquad (0 \lt x \le 6000)$$
<p>Show that $\bar{C}(x)$ is always decreasing on the interval $(0, 6000)$.</p>`,
      terms: [
        ['average cost', '平均成本'],
        ['pressing compact discs', '壓製 CD'],
        ['show that', '證明（要寫出理由，不是只寫答案）'],
        ['always decreasing', '恆遞減（C̄′ < 0）'],
        ['over the interval', '在這個區間上']
      ]
    },
    '4.1-89': {
      page: 268,
      q: R`<p>The volume of first-class mail delivered each year from 2008 through 2012, in billions of pieces, can be approximated by</p>
$$f(t) = \frac{90.7}{0.01t^2 + 0.01t + 1} \qquad (0 \le t \le 4)$$
<p>with $t$ in years and $t = 0$ standing for 2008. Show that this volume was declining during the whole period.</p>`,
      terms: [
        ['volume', '數量（這裡不是體積）'],
        ['first-class mail', '第一類郵件'],
        ['in billions of pieces', '單位是十億件'],
        ['is approximated by', '可以用…近似'],
        ['corresponding to', '對應到'],
        ['declining', '下降（f′ < 0）'],
        ['throughout the period', '整段期間']
      ]
    },

    /* ---------------- 4.2 ---------------- */
    '4.2-65': {
      page: 286,
      q: R`<p>Find the relative extrema of the function, if there are any. Use the Second Derivative Test when it applies.</p>
$$f(x) = \frac13x^3 - 2x^2 - 5x - 5$$`,
      terms: SDT_TERMS
    },
    '4.2-70': {
      page: 286,
      q: R`<p>Find the relative extrema of the function, if there are any. Use the Second Derivative Test when it applies.</p>
$$f(x) = \frac{2x}{x^2 + 1}$$`,
      terms: SDT_TERMS
    },
    '4.2-88': {
      page: 287,
      q: R`<p>For a 2012 medium-sized sedan, the average cost of driving in cents per mile (counting car payments, gas, insurance, upkeep, and depreciation) is approximately</p>
$$C(x) = \frac{1910.5}{x^{1.72}} + 42.9 \qquad (5 \le x \le 20)$$
<p>where $x$ is the number of miles driven per year, in thousands. Show that the graph of $C$ is concave upward on $(5, 20)$. What does this say about how the average cost changes as the car is driven more miles?</p>`,
      terms: [
        ['average cost', '平均成本'],
        ['cents per mile', '每英里幾美分'],
        ['upkeep', '保養'],
        ['depreciation', '折舊'],
        ['in thousands', '單位是千（英里）'],
        ['concave upward', '凹向上（C″ > 0）'],
        ['what does your result tell you', '這個結果說明了什麼（要寫一句解釋）']
      ]
    },
    '4.2-96': {
      page: 288,
      q: R`<p>Energy costs are rising, and the growth rate of a 4-year-old glassblowing company's profit has started to decline. After the company adopts energy-saving measures, its general manager expects the growth rate of the profit to be increasing again within 4 years. Suppose the profit $t$ years from now, in hundreds of dollars, is</p>
$$P(t) = t^3 - 9t^2 + 40t + 50 \qquad (0 \le t \le 8)$$
<p>Is the general manager's forecast accurate?</p>`,
      terms: [
        ['growth rate of the profit', '利潤的成長率（P′）'],
        ['begin to decline', '開始下降（P′ 在遞減）'],
        ['energy-conservation measures', '節能措施'],
        ['be on the increase again', '重新開始上升（P′ 改成遞增）'],
        ['within 4 years', '4 年內'],
        ['in hundreds of dollars', '單位是百美元'],
        ['forecast', '預測'],
        ['determine whether … is accurate', '判斷是否正確（找反曲點在第幾年）']
      ]
    },
    '4.2-100': {
      page: 289,
      q: R`<p>A transit authority projects its cumulative budget deficit, in billions of dollars. With a [$]160 million rescue package, the deficit is</p>
$$D_1(t) = 0.0275t^2 + 0.081t + 0.07 \qquad (0 \le t \le 3)$$
<p>Without the rescue package, it is</p>
$$D_2(t) = 0.035t^2 + 0.211t + 0.24 \qquad (0 \le t \le 3)$$
<p>In both formulas $t$ is in years and $t = 0$ stands for 2011. Let $D = D_2 - D_1$.</p>
<p>(a) Show that $D$ is increasing on $(0, 3)$, and interpret the result.<br>
(b) Show that the graph of $D$ is concave upward on $(0, 3)$, and interpret the result.</p>`,
      terms: [
        ['projected', '預估的'],
        ['cumulative', '累計的'],
        ['budget deficit', '預算赤字'],
        ['rescue package', '紓困方案'],
        ['show that', '證明（要寫出理由）'],
        ['increasing on (0, 3)', '在 (0, 3) 上遞增（D′ > 0）'],
        ['concave upward', '凹向上（D″ > 0）'],
        ['interpret your result', '解釋結果的意義']
      ]
    },

    /* ---------------- 4.3 ---------------- */
    '4.3-55': {
      page: 300,
      q: R`<p>Sketch the graph of the function. Follow the curve-sketching guide.</p>
$$g(t) = -\frac{t^2 - 2}{t - 1}$$`,
      terms: SKETCH_TERMS
    },
    '4.3-56': {
      page: 300,
      q: R`<p>Sketch the graph of the function. Follow the curve-sketching guide.</p>
$$f(x) = \frac{x^2 - 9}{x^2 - 4}$$`,
      terms: SKETCH_TERMS
    },
    '4.3-60': {
      page: 300,
      q: R`<p>Sketch the graph of the function. Follow the curve-sketching guide.</p>
$$g(x) = (x + 2)^{3/2} + 1$$`,
      terms: SKETCH_TERMS
    },

    /* ---------------- 4.5 ---------------- */
    '4.5-4': {
      page: 327,
      q: R`<p>A rancher has 3000 yd of fencing and wants to enclose a rectangular grazing area beside a straight river. The side along the river needs no fence. One extra fence, parallel to the two sides, will divide the area into two parts. Find the dimensions that give the largest enclosed area, and find that area.</p>`,
      terms: [
        ['fencing', '圍籬'],
        ['enclose', '圍起來'],
        ['rectangular', '矩形的'],
        ['grazing land', '牧地'],
        ['no fencing is required along the river', '靠河那一側不用圍'],
        ['subdivide', '隔成兩塊'],
        ['running parallel to the sides', '和兩側平行（多一道 x）'],
        ['dimensions', '尺寸（兩個邊長）'],
        ['largest area', '最大面積']
      ]
    },
    '4.5-9': {
      page: 327,
      q: R`<p>A pencil cup is to hold 36 in.³. It is a rectangular box with a square base and no top. Material for the sides costs 15¢ per square inch, and material for the base costs 40¢ per square inch. Find the dimensions of the cup that minimize the cost of the material.</p>`,
      terms: [
        ['capacity', '容量（就是體積）'],
        ['rectangular box', '長方體'],
        ['square base', '正方形的底'],
        ['open top', '沒有蓋子'],
        ['sides', '側面（四片）'],
        ['base', '底'],
        ['dimensions', '尺寸（底邊長和高）'],
        ['minimize the construction cost', '讓製作成本最低']
      ]
    },
    '4.5-18': {
      page: 328,
      q: R`<p>A Norman window is a rectangle with a semicircle on top. The perimeter of the window must be 28 ft. Find the dimensions that let the most light through the window.</p>`,
      terms: [
        ['Norman window', '諾曼窗'],
        ['rectangle', '矩形'],
        ['surmounted by', '上面接著'],
        ['semicircle', '半圓'],
        ['perimeter', '周長'],
        ['dimensions', '尺寸'],
        ['maximum amount of light', '最多的光（面積最大）']
      ]
    },
    '4.5-20': {
      page: 329,
      q: R`<p>In an apple orchard planted with 22 trees per acre, each tree yields 36 bushels of apples on average. Every additional tree per acre lowers the yield of each tree by 2 bushels. How many trees per acre give the maximum total yield?</p>`,
      terms: [
        ['orchard', '果園'],
        ['yield', '產量'],
        ['bushel', '蒲式耳（容量單位）'],
        ['tree density', '種植密度（每英畝幾棵）'],
        ['acre', '英畝'],
        ['for each unit increase', '每增加 1 單位（每多種 1 棵）'],
        ['maximize the yield', '讓產量最大']
      ]
    },
    '4.5-21': {
      page: 329,
      q: R`<p>A luxury yacht takes passengers on cruises. With exactly 20 people signed up, the fare is [$]600 per person per day. The yacht holds at most 90 people, and for every passenger beyond 20, the fare of <em>every</em> passenger drops by [$]4. At least 20 people will sign up. How many passengers give the owner the maximum revenue? What is that revenue, and what is the fare per passenger?</p>`,
      terms: [
        ['yacht', '遊艇'],
        ['charge', '收費'],
        ['exactly 20 people', '剛好 20 人'],
        ['sign up', '報名'],
        ['maximum capacity', '最大載客量'],
        ['fare', '票價'],
        ['every fare is reduced by', '每個人的票價都減少'],
        ['each additional passenger', '每多一位乘客'],
        ['revenue', '收益（人數 × 票價）'],
        ['fare per passenger', '每位乘客的票價']
      ]
    },
    '4.5-26': {
      page: 329,
      q: R`<p>A grain silo is a right circular cylinder with a hemisphere on top. Its capacity must be $504\pi$ ft³. Find the radius and the height of the cylinder for which the silo needs the least material.</p>
<p>Hint: the volume is $\pi r^2h + \tfrac23\pi r^3$, and the surface area, floor included, is $\pi(3r^2 + 2rh)$.</p>`,
      terms: [
        ['grain silo', '穀倉'],
        ['right circular cylinder', '直立的圓柱'],
        ['surmounted by a hemisphere', '上面接一個半球'],
        ['capacity', '容量（體積）'],
        ['radius', '半徑'],
        ['height', '高'],
        ['least amount of material', '最少的材料（表面積最小）'],
        ['surface area', '表面積'],
        ['including the floor', '包含地板']
      ]
    },
    '4.5-29': {
      page: 330,
      q: R`<p>A bird flies at 4 mph over water and 6 mph over land. It leaves point $E$ on an island that is 3 mi from a straight shore and flies to its nest $N$, which is on the shore 12 mi from the point closest to the island. The bird first crosses the water to a point $P$ on the shore and then flies along the shore to $N$. Where should $P$ be so that the trip takes the minimum time? (Solve for $x$, the distance marked in the textbook figure.)</p>`,
      terms: [
        ['constant speed', '等速'],
        ['mph', '英里／小時'],
        ['over water / over land', '在水面上／在陸地上'],
        ['island', '島'],
        ['nest', '鳥巢'],
        ['shore', '岸邊'],
        ['mainland', '陸地（本土）'],
        ['minimum time', '最短時間（時間 = 距離 ÷ 速度）'],
        ['solve for x', '解出 x']
      ]
    },
    '4.5-30': {
      page: 330,
      q: R`<p>A woman sits in a rowboat on a lake. The nearest point of the straight shoreline, $P$, is 1 mi away. Her destination $Q$ is on the shore, 10 mi from $P$. She will row to some point $R$ between $P$ and $Q$ and walk from there. She rows at 3 mph and walks at 4 mph. Which point $R$ gets her to $Q$ in the shortest time, and how long does the trip take?</p>`,
      terms: [
        ['rowboat', '划艇'],
        ['the closest point', '最近的點'],
        ['shoreline', '湖岸'],
        ['row', '划船'],
        ['walk the rest of the distance', '剩下的路用走的'],
        ['as quickly as possible', '越快越好（時間最短）'],
        ['how much time does she require', '需要多少時間']
      ]
    },

    /* ---------------- 5.6 ---------------- */
    '5.6-15': {
      page: 400,
      q: R`<p>A corporation expects its sales to grow exponentially, from [$]100 million in 2010 to [$]150 million in 2015.</p>
<p>(a) Write a model for the sales in year $t$, taking $t = 0$ for 2010 and $t = 5$ for 2015.<br>
(b) What were the sales in 2013?</p>`,
      terms: [
        ['sales', '銷售額'],
        ['are projected to', '預計'],
        ['grow exponentially', '指數成長（S = S₀e^(kt)）'],
        ['million', '百萬'],
        ['find a model', '求出模型（寫出公式）']
      ]
    },
    '5.6-16': {
      page: 400,
      q: R`<p>A school for court reporters runs a 20-week course in machine shorthand. After $t$ weeks in the course, the average student can take dictation at</p>
$$Q(t) = 120\left(1 - e^{-0.05t}\right) + 60 \qquad (0 \le t \le 20)$$
<p>words per minute. Sketch the graph of $Q$, then answer:</p>
<p>(a) How fast can the average student take dictation at the start of the course?<br>
(b) What speed is reached halfway through the course?<br>
(c) What speed is reached at the end of the course?</p>`,
      terms: [
        ['learning curve', '學習曲線'],
        ['shorthand', '速記'],
        ['intensive', '密集的'],
        ['dictation', '聽寫'],
        ['words per minute', '每分鐘幾個字'],
        ['beginning speed', '一開始的速度（t = 0）'],
        ['halfway through the course', '課程上到一半（t = 10）'],
        ['after completing the course', '結業後（t = 20）']
      ]
    },
    '5.6-19': {
      page: 400,
      q: R`<p>A company brings out a new line of home computers. After the line has been on the market for $t$ months, the monthly demand is</p>
$$D(t) = 2000 - 1500e^{-0.05t} \qquad (t \gt 0)$$
<p>Graph the function, then answer:</p>
<p>(a) What is the demand after 1 month, after 1 year, after 2 years, and after 5 years?<br>
(b) At what level will the demand stabilize?<br>
(c) What is the rate of growth of the demand after the tenth month?</p>`,
      terms: [
        ['monthly demand', '每月需求量'],
        ['placed on the market', '上市'],
        ['after 1 year', '一年後（t 的單位是月，所以 t = 12）'],
        ['at what level', '在什麼水準'],
        ['stabilize', '穩定下來（t 很大時趨近的值）'],
        ['rate of growth', '成長率（D′(t)）'],
        ['after the tenth month', '第 10 個月後（t = 10）']
      ]
    },
    '5.6-22': {
      page: 401,
      q: R`<p>A flu epidemic hits a school system. After $t$ days, the number of children who have caught the flu is</p>
$$Q(t) = \frac{1000}{1 + 199e^{-0.8t}}$$
<p>(a) How many children have the flu after the first day?<br>
(b) How many have it after 10 days?<br>
(c) How many children eventually get the disease?</p>`,
      terms: [
        ['epidemic', '流行病'],
        ['flu / influenza', '流感'],
        ['contracted', '感染了'],
        ['were stricken by', '染上'],
        ['after the first day', '第一天後（t = 1）'],
        ['eventually', '最後（t 很大時趨近的值）'],
        ['disease', '疾病']
      ]
    },
    '5.6-23': {
      page: 401,
      q: R`<p>In a laboratory experiment with a limited food supply, the size of a fruit fly population $t$ days after the start is approximated by</p>
$$N(t) = \frac{400}{1 + 39e^{-0.16t}}$$
<p>(a) How many fruit flies were there at the start?<br>
(b) What is the largest population that can be expected under these conditions?<br>
(c) How large was the population on the 20th day?<br>
(d) How fast was the population changing on the 20th day?</p>`,
      terms: [
        ['fruit fly', '果蠅'],
        ['population', '族群數量'],
        ['limited food supply', '食物有限'],
        ['initial', '一開始的（t = 0）'],
        ['maximum population', '最大數量（t 很大時趨近的值）'],
        ['colony', '群落'],
        ['on the 20th day', '第 20 天（t = 20）'],
        ['how fast … changing', '變化多快（N′(20)）']
      ]
    },
    '5.6-24': {
      page: 401,
      q: R`<p>The number of citizens between 45 and 64 years old, in millions, is approximated by</p>
$$P(t) = \frac{197.9}{1 + 3.274e^{-0.0361t}} \qquad (0 \le t \le 20)$$
<p>Here $t$ is in years and $t = 0$ is the beginning of 1990. How many citizens in this age group were expected in 2010?</p>`,
      terms: [
        ['citizens aged 45–64 years', '45 到 64 歲的國民'],
        ['is approximated by', '可以用…近似'],
        ['is measured in millions', '單位是百萬人'],
        ['corresponding to', '對應到'],
        ['expected population', '預期人數'],
        ['in 2010', '2010 年（t = 20）']
      ]
    },
    '5.6-27': {
      page: 401,
      q: R`<p>A college dedicated a new building, and 300 students were at the ceremony. There the president announced a new expansion program. After $t$ hours, the number of students who know about the program is</p>
$$f(t) = \frac{3000}{1 + Be^{-kt}}$$
<p>Two hours after the ceremony, 600 students knew about it.</p>
<p>(1) How many students knew about it after 4 hours?<br>
(2) How fast was the news spreading at that time?</p>`,
      terms: [
        ['three hundred students attended', '300 名學生參加（t = 0 時就有 300 人知道）'],
        ['dedication ceremony', '落成典禮'],
        ['announced', '宣布'],
        ['had learned of / had heard about', '得知'],
        ['hr', '小時（hour）'],
        ['is given by the function', '由這個函數給出'],
        ['how fast was the news spreading', '消息傳得多快（f′(4)）']
      ]
    }
  };
})();
