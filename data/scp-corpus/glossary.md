# Supply Chain Planning Glossary — 90 Terms

**How to use this file**

1. **朗读 (Read aloud)**: Read the **English** line first to lock in the one-sentence definition, then the **中文** line to cross-check meaning.
2. **30s script**: Practice the speakable paragraph out loud as if answering "What is X and where have you used it?" in a B2–C1 interview. Scripts are grounded in enterprise SCP delivery (Panasonic, Danone, Hisense, airline crew rostering, CPLEX/Gurobi, Pixi Gantt, APS/MRP) — replace placeholders like **【填入真实数字】** with your real project numbers before interviews.

---

## 1. 计划核心 (Planning Core) — 18 terms

### MRP (Material Requirements Planning)
- **English**: MRP translates independent demand from the master schedule into dependent requirements for components and raw materials over a rolling time horizon.
- **中文**: MRP 将主生产计划中的独立需求，按时间展开为零部件与原材料的从属需求。
- **30s script**: In our Panasonic SCP rollout, MRP was the engine that exploded finished-good demand down through multi-level BOMs and generated planned purchase and production orders. I worked on the netting logic and pegging views so planners could trace why a sub-assembly was short. When lead times or lot sizes changed, we re-ran regeneration and compared exception messages before releasing orders to ERP.

### MPS (Master Production Schedule)
- **English**: The MPS states what finished products will be built, in what quantities, and when, and it drives all downstream planning.
- **中文**: MPS 规定成品在何时、以何种数量生产，并驱动所有下游计划。
- **30s script**: On the Hisense APS project, the MPS was the single authoritative schedule for finished goods that MRP and capacity checks consumed. I helped build the time-phased grid where planners could firm orders inside the demand time fence and see ATP impact immediately. We aligned MPS refresh cadence with S&OP so marketing promotions did not surprise the factory.

### S&OP (Sales and Operations Planning)
- **English**: S&OP is a cross-functional monthly process that balances demand, supply, inventory, and financial targets into one agreed operating plan.
- **中文**: S&OP 是跨职能月度流程，将需求、供应、库存与财务目标平衡为一致的经营计划。
- **30s script**: For Danone's supply chain planning suite, S&OP was the executive layer above operational MPS and DRP. I contributed to the consensus demand view and the supply feasibility screen that showed where capacity or material constraints blocked the revenue plan. The 30s story I tell is how we turned spreadsheet debates into a single version of the truth before freezing the next month's production mix.

### DRP (Distribution Requirements Planning)
- **English**: DRP plans inventory replenishment across warehouses and distribution centers based on forecasted or actual demand and lead times.
- **中文**: DRP 根据预测或实际需求与提前期，规划各仓与配送中心的库存补货。
- **30s script**: In a multi-echelon deployment for a consumer goods client, DRP calculated planned transfers from the central factory warehouse to regional DCs. I integrated DRP output with WMS min/max alerts so planners saw both the optimization proposal and on-hand reality. Lead-time variability was modeled with safety time buffers at each echelon.

### APS (Advanced Planning and Scheduling)
- **English**: APS uses constraint-aware algorithms and optimization to create feasible, cost-aware production and distribution schedules beyond classic MRP logic.
- **中文**: APS 采用考虑约束的算法与优化，在经典 MRP 之外生成可行且兼顾成本的生产与配送排程。
- **30s script**: APS was the product category for most of my six years — finite-capacity scheduling, sequence-dependent setups, and optional solver-backed re-optimization. On Panasonic lines we replaced infinite MRP dates with APS schedules that respected parallel work centers and calendar exceptions. I also built the Pixi.js Gantt front end that rendered APS output at scale for shop-floor dispatch.

### MRP II (Manufacturing Resource Planning)
- **English**: MRP II extends MRP by adding capacity planning, shop-floor feedback, and financial visibility in a closed-loop manufacturing planning cycle.
- **中文**: MRP II 在 MRP 基础上增加产能计划、车间反馈与财务可视，形成闭环制造计划。
- **30s script**: When interviewers ask how MRP differs from MRP II, I explain that MRP II closes the loop with RCCP, shop-floor status, and cost roll-ups. In our SCP modules we mapped classic MRP II steps — plan, execute, measure — even though the UI was modern web. That framing helps non-planner hiring managers understand why we had both planning and execution integrations.

### CRP (Capacity Requirements Planning)
- **English**: CRP checks whether detailed routings and planned orders fit available work-center capacity over time.
- **中文**: CRP 检验详细工艺路线与计划订单是否能在时间上匹配工作中心可用产能。
- **30s script**: After MRP generated planned orders, CRP loaded each operation onto work centers and flagged overload periods. I implemented drill-down from CRP exceptions into the APS finite scheduler so planners could drag operations within the frozen zone rules. For Hisense, showing CRP load charts next to the Gantt reduced back-and-forth between planning and production managers.

### RCCP (Rough-Cut Capacity Planning)
- **English**: RCCP validates the MPS against key bottleneck resources using simplified routings before detailed MRP runs.
- **中文**: RCCP 在详细 MRP 运行前，用简化工艺路线校验 MPS 是否符合关键瓶颈资源。
- **30s script**: RCCP was our early warning in S&OP — typically at the product-family level on critical lines. I wired RCCP to use bottleneck work centers only, so the monthly executive review did not drown in detail. When RCCP showed infeasibility, the team either shifted MPS quantities or triggered capacity elevation projects.

### LTP (Long-Term Planning)
- **English**: Long-term planning projects demand, capacity, and inventory policy over horizons beyond operational MRP, often for strategic and budgeting decisions.
- **中文**: 长期计划在一个超出 MRP 运行周期的视野上投影需求、产能与库存策略，用于战略与预算决策。
- **30s script**: LTP modules in enterprise SCP support 12–18 month views with coarse buckets. I helped a solar manufacturing client compare capital scenarios — adding a line versus overtime — using LTP capacity versions. Numbers stay at **【填入真实数字】** level in interviews, but the narrative is translating strategic questions into scenario-based plans.

### MRP Explosion
- **English**: MRP explosion walks the bill of materials level by level to calculate gross requirements for every component tied to higher-level demand.
- **中文**: MRP 展开按 BOM 层级逐级计算与上层需求相关的各组件总需求量。
- **30s script**: Explosion performance mattered on deep BOMs for appliance and beverage clients. We cached BOM effectivity dates and alternate structures so regeneration did not re-read thousands of rows each night. When debugging shortages, I used pegging traces from explosion results to show planners exactly which finished-good order consumed a scarce chip.

### Netting
- **English**: Netting subtracts on-hand inventory, scheduled receipts, and allocations from gross requirements to yield net planned requirements.
- **中文**: 净额计算从总需求中扣减现有库存、在途收货与分配量，得到净计划需求。
- **30s script**: Netting sounds trivial until you add multi-plant inventory, quality holds, and consignment stock. In our SCP core I worked on netting rules that respected plant-specific on-hand and project allocations. Planners trusted the net requirements because exceptions surfaced when scheduled receipts slipped past need dates.

### Pegging
- **English**: Pegging links each dependent requirement to its ultimate independent demand source for traceability across the plan.
- **中文**: 追溯将每项从属需求与其最终独立需求来源关联，实现计划可追溯。
- **30s script**: Pegging was essential when Hisense planners asked "why are we buying this motor?" I built upward and downward pegging views in the UI so users could navigate from SO line to component PO in clicks. In interviews I emphasize pegging as the audit trail that separates serious SCP from spreadsheet MRP.

### Planned Order Release
- **English**: Planned order release converts system-generated planned orders into firm ERP purchase or production orders subject to approval rules.
- **中文**: 计划订单释放将系统生成的计划订单，在审批规则约束下转为 ERP 中的正式采购或生产订单。
- **30s script**: Release was the controlled gateway to ERP — we supported batch release with exception filtering so planners did not push every line blindly. Integration tests with Panasonic's ERP covered idempotent release and rollback when validation failed. I describe it as the moment planning becomes execution.

### Firm Planned Order
- **English**: A firm planned order is frozen against automatic replanning changes until a planner explodes or unfirms it manually.
- **中文**: 确认计划订单在计划员手动取消确认前，不会被自动重计划改动。
- **30s script**: Inside the planning time fence, firm orders protected shop-floor stability. I implemented visual cues on the Gantt — dashed versus solid bars — so users saw which operations were firm. When MRP regeneration ran, firm orders stayed fixed while unfirmed supply shifted, which matched how production managers expected frozen periods to behave.

### Planning Time Fence
- **English**: The planning time fence defines a horizon inside which the system restricts automatic changes to scheduled quantities or dates.
- **中文**: 计划时间栏界内，系统限制对计划数量或日期的自动变更。
- **30s script**: Time fences were configurable per plant and product family on our APS product. I documented how demand time fence protected MPS from forecast churn while planning time fence protected released shop orders. Interviewers often ask how this differs from frozen zone — I explain fences are MRP policy, frozen zone is scheduling UX.

### Demand Time Fence
- **English**: The demand time fence prevents forecast updates from overwriting customer-driven MPS entries within a near-term window.
- **中文**: 需求时间栏阻止预测更新在近期窗口内覆盖由客户订单驱动的 MPS 条目。
- **30s script**: For make-to-stock lines at consumer clients, the demand time fence stopped statistical forecast from swamping confirmed promotions near term. We aligned fence length with **【填入真实数字】** days of customer order visibility. That design reduced nightly MPS churn and made S&OP commitments credible to factories.

### Time-Phased Plan
- **English**: A time-phased plan shows requirements, receipts, and projected balances bucketed by day or week across the planning horizon.
- **中文**: 分时段计划按日或周展示计划期内需求、收货与预计结存量。
- **30s script**: Every planner screen I built revolved around time-phased grids — MPS, MRP, and inventory projection. The Pixi Gantt was the graphical sibling; the grid was the numerical source of truth. I tell candidates to practice reading a time-phased row aloud: beginning on-hand, gross req, scheduled receipts, projected available.

### Regenerative MRP
- **English**: Regenerative MRP rebuilds all material plans from scratch each run rather than net-changing only affected items.
- **中文**: 再生式 MRP 每次运行从头重建全部物料计划，而非仅对受影响项做增量变更。
- **30s script**: Our nightly batch for large enterprises used regenerative MRP for consistency after master-data changes. Net change was available for intraday what-if. I integrated job monitoring so planners saw when regeneration finished before opening ATP inquiries — a small UX detail that prevented stale answers in Danone training sessions.

---

## 2. 制造与排程 (Manufacturing & Scheduling) — 18 terms

### Finite Capacity Scheduling
- **English**: Finite capacity scheduling ensures no work center is loaded beyond its available capacity in any period.
- **中文**: 有限产能排程确保任何时段内工作中心负荷不超过其可用产能。
- **30s script**: Finite scheduling was the heart of our APS value prop versus infinite MRP dates. On Panasonic assembly lines we modeled parallel machines and shift calendars so the solver never double-booked a bottleneck. I connected finite schedules to the Pixi Gantt with drag-and-drop rescheduling that re-validated capacity after each move.

### Infinite Capacity Planning
- **English**: Infinite capacity planning assumes unlimited resources when dating operations, useful for rough feasibility before detailed scheduling.
- **中文**: 无限产能计划在排定工序日期时假设资源不受限，适用于详细排程前的粗可行性分析。
- **30s script**: Classic MRP backward scheduling is infinite — it ignores overload. We used infinite plans for fast what-if and RCCP-style checks, then promoted feasible windows to finite APS. In interviews I clarify that infinite is not wrong; it is the wrong tool for dispatch lists on constrained lines.

### Routing
- **English**: A routing defines the sequence of operations, work centers, and standard times required to manufacture an item.
- **中文**: 工艺路线定义生产某物料所需的工序顺序、工作中心与标准工时。
- **30s script**: Routing master data quality determined APS credibility. I worked on import validators that flagged missing setup times or wrong work-center calendars before scheduling. For Hisense, alternate routings let planners switch when a coating line was down without rebuilding the BOM.

### BOM (Bill of Materials)
- **English**: A BOM lists components, quantities, and relationships needed to produce a parent item, including phantom and co-product structures.
- **中文**: BOM 列出生产父项所需的组件、用量与结构关系，含虚拟件与联产品结构。
- **30s script**: Multi-level BOMs with effectivity and substitutes were daily work in SCP delivery. I debugged explosion errors when engineering released a new BOM revision mid-week. My interview line: APS is only as accurate as BOM and routing master data — garbage in, optimistic schedules out.

### Lead Time
- **English**: Lead time is the elapsed time between initiating and completing a supply or manufacturing step, including queue, run, and move elements.
- **中文**: 提前期是启动与完成供应或制造步骤之间的 elapsed 时间，含排队、加工与转移。
- **30s script**: We modeled lead time as fixed, variable, or calendar-aware depending on vendor reliability. Safety lead time was a lever planners used when chip shortages hit **【填入真实数字】** suppliers. I integrated lead-time updates from ERP receipts so MRP did not keep planning against outdated vendor performance.

### Frozen Zone
- **English**: The frozen zone is a near-term scheduling window where changes require explicit planner approval to protect shop-floor stability.
- **中文**: 冻结区是近期排程窗口，变更需计划员明确批准，以保障车间稳定。
- **30s script**: On the Gantt UI, dragging a bar inside the frozen zone triggered a confirmation and permission check. Frozen length differed by plant — Panasonic wanted **【填入真实数字】** days firm while pilot sites allowed more flexibility. I explain frozen zone as the scheduling counterpart to firm planned orders.

### Work Center
- **English**: A work center is a capacity entity — machine, line, or labor group — where routing operations are executed and loaded.
- **中文**: 工作中心是执行工艺工序并承担负荷的产能实体，可为机器、产线或班组。
- **30s script**: APS models work centers with calendars, efficiency, and parallel capacity. I built maintenance calendar integration so planned downtime appeared as capacity holes. When optimizing, we tagged bottleneck work centers for TOC-style drum scheduling on beverage filling lines.

### Setup Time
- **English**: Setup time is the non-productive interval to prepare a work center when switching products or tooling.
- **中文**: 换型/setup 时间是为切换产品或工装而准备工作中心的非生产间隔。
- **30s script**: Sequence-dependent setup matrices drove major savings in APS re-optimization for Danone SKU mixes. The solver batching similar flavors together reduced changeovers per shift. I exposed setup violations on the Gantt so planners saw why an apparently idle gap was actually a mandatory cleaning window.

### Cycle Time
- **English**: Cycle time is the average time to complete one unit of production at a operation, excluding setup and queue.
- **中文**: 周期时间是某工序完成一个生产单位的平均时间，不含 setup 与排队。
- **30s script**: Standard cycle times from engineering routes fed our APS engine; actuals could be imported from MES for feedback loops. When cycle time drifted on Hisense SMT lines, capacity plans were wrong until master data caught up — a story I use to explain planning-execution closed loop.

### Bottleneck Resource
- **English**: A bottleneck resource limits overall throughput because its capacity is less than or equal to demand placed upon it.
- **中文**: 瓶颈资源的产能限制整体产出，因其产能小于或等于所承受的需求。
- **30s script**: Identifying bottlenecks was step one in finite scheduling engagements. We highlighted constraint work centers in red on load charts and synchronized MPS volume to their takt. For interview narrative I link bottleneck management to both APS optimization and TOC drum-buffer-rope without conflating the two.

### Dispatch List
- **English**: A dispatch list ranks operations assigned to a work center in the sequence shop floor should execute them.
- **中文**: 派工单列出分配到某工作中心、应按顺序执行的工序清单。
- **30s script**: APS output became dispatch lists printed or sent to MES terminals. I ensured the Pixi Gantt could filter by work center and export the same sequence operations teams saw on paper. When priorities changed intraday, re-dispatch respected frozen rules and logged who overrode them.

### Gantt Chart
- **English**: A Gantt chart visualizes tasks or operations on a timeline, showing start, finish, duration, and dependencies.
- **中文**: 甘特图在时间轴上可视化任务或工序的起止、时长与依赖关系。
- **30s script**: I spent years on a Pixi.js Canvas Gantt rendering **【填入真实数字】** tasks with virtualized rows and Web Worker transforms for Panasonic and internal APS products. It supports FS/SS/FF/SF dependencies, drag reschedule, and conflict preview — the portfolio piece I demo when hiring managers ask for front-end depth in SCP.

### Production Dependency
- **English**: Production dependencies define precedence between operations — finish-to-start and related logic — that constrain scheduling sequence.
- **中文**: 生产依赖定义工序间先后顺序约束，如结束-开始等，限制排程序列。
- **30s script**: Modeling dependencies correctly prevented APS from scheduling assembly before components arrived. I validated dependency cycles on import and drew dependency edges on the Pixi layer. Complex cases — overlap allowed with lag — came up on long assembly routings for appliance clients.

### Make-to-Stock (MTS)
- **English**: Make-to-stock produces to forecast and fills customer orders from finished-goods inventory rather than bespoke production.
- **中文**: 按库存生产依据预测制造，从成品库存满足客户订单而非按单定制。
- **30s script**: Hisense white-goods lines were classic MTS — MPS driven by forecast with ATP promising from inventory. I explain how MTS shifts planning risk to forecast accuracy and safety stock, whereas MTO shifts it to lead-time quoting.

### Make-to-Order (MTO)
- **English**: Make-to-order triggers production only after a customer order is accepted, often with configurable BOM options.
- **中文**: 按订单生产在接收客户订单后才触发生产，常含可配置 BOM 选项。
- **30s script**: MTO modules required CTP checks before order confirmation. We pegged each customer order through explosion so planners saw component availability per SO line. Interview tip: MTO success depends on routing accuracy and realistic quoted lead times, not just MRP settings.

### Assemble-to-Order (ATO)
- **English**: Assemble-to-order stocks components and finalizes assembly only when a specific customer configuration is ordered.
- **中文**: 按订单装配预先备料，在收到特定客户配置订单后才完成最终装配。
- **30s script**: ATO sat between MTS and MTO in a Danone packaging scenario — base kits in stock, label variant at order entry. Planning ran MRP on components plus final assembly routes triggered by configuration rules. I use ATO to show I understand hybrid decoupling points in the supply chain.

### Lot Sizing
- **English**: Lot sizing rules determine planned order quantities — lot-for-lot, fixed order quantity, or economic order quantity — in MRP.
- **中文**: 批量规则决定 MRP 中计划订单数量，如逐批、固定批量或经济订货批量。
- **30s script**: Wrong lot sizing created artificial peaks on bottleneck lines. We configured part-level lot policies and let APS smooth with minimum batch constraints where finance allowed. Planners could override with reason codes captured for audit — a detail enterprise buyers appreciate.

### Operation Splitting
- **English**: Operation splitting divides a operation's quantity across parallel work centers or time periods to relieve overload.
- **中文**: 工序拆分将某工序数量分到并行工作中心或时间段，以缓解过载。
- **30s script**: When finite scheduling hit infeasibility, splitting let the same welding operation run on two fixtures overnight. The APS solver could auto-split with minimum chunk rules; manual split was also available on the Gantt. I mention splitting when interviewers ask how we handled overload without simply pushing dates infinitely forward.

---

## 3. 库存与需求 (Inventory & Demand) — 15 terms

### Safety Stock
- **English**: Safety stock is buffer inventory held to absorb demand or supply variability while maintaining a target service level.
- **中文**: 安全库存是为吸收需求或供应波动、维持目标服务水平而持有的缓冲库存。
- **30s script**: Safety stock policies varied by ABC class — A items got dynamic safety based on forecast error, C items used rules of thumb. In S&OP reviews we showed inventory rupees or euros tied to service targets using **【填入真实数字】** service level assumptions. I integrated safety stock into ATP calculations so sales saw realistic promise dates.

### ATP (Available-to-Promise)
- **English**: ATP calculates how much inventory or future supply can be committed to new customer orders without breaking existing promises.
- **中文**: ATP 计算在不违背已有承诺的前提下，有多少库存或未来供应可承诺给新客户订单。
- **30s script**: ATP screens were daily tools for Hisense order management teams. I implemented time-phased ATP with allocation rules — first-come versus priority customers. When ATP went negative, the UI showed the first constraint — stock, capacity, or component — which reduced escalations to planners.

### CTP (Capable-to-Promise)
- **English**: CTP extends ATP by checking whether production and material plans can support a requested delivery date before accepting an order.
- **中文**: CTP 在接单前扩展 ATP，检验生产与物料计划是否支持所要求交期。
- **30s script**: CTP ran finite capacity checks plus component availability for MTO quotes. On Danone pilot lines, CTP responses fed a customer service portal with realistic dates instead of static lead-time master data. I describe CTP as ATP plus APS — promise only what you can actually schedule.

### Demand Planning
- **English**: Demand planning forecasts independent demand using statistical models, sales input, and market intelligence over a rolling horizon.
- **中文**: 需求计划在滚动视野内，用统计模型、销售输入与市场信息预测独立需求。
- **30s script**: Demand planning modules fed our MPS and DRP with consensus numbers. I connected planner overrides with audit trails so S&OP could see who changed the beverage SKU forecast. Integration points included Excel upload and ERP historical shipments — typical enterprise SCP plumbing I maintained.

### Statistical Forecast
- **English**: Statistical forecast generates baseline demand projections from historical shipments using methods such as exponential smoothing or ARIMA.
- **中文**: 统计预测用指数平滑、ARIMA 等方法，基于历史出货生成基准需求预测。
- **30s script**: We exposed forecast methods per SKU with seasonality and trend flags. Forecast error dashboards used MAPE at **【填入真实数字】** aggregation level for monthly S&OP. I am honest in interviews: I integrated forecasting engines; PhD-level model design was the client's analytics team, not my lane.

### Forecast Consumption
- **English**: Forecast consumption reduces open forecast by actual customer orders in the same period so MPS is not double-counted.
- **中文**: 预测消耗用同期实际客户订单扣减未结预测，避免 MPS 重复计算。
- **30s script**: Consumption logic mattered for Hisense MTS lines where SO lines ate forecast buckets week by week. Misconfigured consumption showed phantom demand in MRP. I documented forward versus backward consumption rules because sales and planning argued about them every quarter.

### Demand Sensing
- **English**: Demand sensing uses near-real-time data — POS, channel inventory — to adjust short-term forecasts faster than monthly cycles.
- **中文**: 需求感知利用 POS、渠道库存等近实时数据，比月度周期更快调整短期预测。
- **30s script**: Where clients had POS feeds, we shortened the forecast horizon inside **【填入真实数字】** weeks. Demand sensing sat adjacent to classic DFP — same UI patterns, different refresh cadence. I position it as execution-layer correction, not replacement for S&OP consensus.

### Service Level
- **English**: Service level measures the probability of fulfilling demand from available stock without stockout over a defined period.
- **中文**: 服务水平衡量在定义期间内从不缺货可用库存满足需求的概率。
- **30s script**: Safety stock calculations referenced target service levels — often **【填入真实数字】** percent for A SKUs. In inventory review meetings we traded service versus carrying cost explicitly. SCP software makes that trade visible instead of hiding it in planner tribal knowledge.

### Reorder Point
- **English**: A reorder point triggers replenishment when inventory falls to a predefined level accounting for lead-time demand.
- **中文**: 再订货点在库存降至预设水平时触发补货，该水平考虑提前期内需求。
- **30s script**: Reorder point logic appeared in DRP for spare parts and low-value components where full MRP was overkill. We synced ROP with ERP min/max and highlighted parts crossing the point on planner dashboards. Simple rule, but important for explaining multi-echelon inventory to interviewers.

### EOQ (Economic Order Quantity)
- **English**: EOQ balances ordering and holding costs to suggest a cost-minimizing order quantity under steady demand assumptions.
- **中文**: EOQ 在稳态需求假设下平衡订货与持有成本，给出使总成本最小的订货量。
- **30s script**: EOQ was a lot-sizing option for stable bulk materials — resin, packaging — not for every SKU. I mention EOQ to show classical inventory literacy while noting APS clients often prefer constraint-driven batching over pure EOQ when capacity binds.

### Inventory Turnover
- **English**: Inventory turnover measures how often stock is sold or used relative to average inventory, indicating working capital efficiency.
- **中文**: 库存周转率衡量库存相对平均库存的出售或使用频次，反映营运资本效率。
- **30s script**: S&OP dashboards showed turnover and days of supply alongside unit fill rate. When Panasonic inventory rose after forecast misses, the narrative linked planner actions — lot size, safety stock — to finance KPIs. I use turnover as the bridge between operations and CFO language.

### ABC Analysis
- **English**: ABC analysis classifies items by revenue or usage concentration so planners apply tighter controls to high-impact SKUs.
- **中文**: ABC 分析按收入或使用集中度分类物料，使计划员对高影响 SKU 施加更严管控。
- **30s script**: ABC drove default forecast methods, cycle-count frequency, and safety stock policies in our templates. A items got finite scheduling scrutiny; C items got reorder points. Enterprise rollouts started with ABC master-data cleanup — unsexy but high leverage.

### Projected Available Balance
- **English**: Projected available balance shows expected on-hand inventory after each time bucket's supply and demand transactions.
- **中文**: 预计可用结存显示各时段供需交易后的预期在手库存。
- **30s script**: Every MRP planner learned to scan projected available for negative buckets — that was the stockout early warning. I colored negative cells and linked them to pegging in the UI. Interview drill: read projected available aloud across three buckets; it proves you understand time-phased logic.

### Allocation
- **English**: Allocation reserves supply or capacity for specific demands — orders, regions, or priorities — before ATP is offered elsewhere.
- **中文**: 分配为特定需求（订单、区域或优先级）预留供应或产能，再向其他渠道提供 ATP。
- **30s script**: Allocation rules decided whether scarce TV panels went to export versus domestic channels at Hisense. Hard allocation froze quantity; soft allocation was planning guidance only. I implemented allocation audit logs because sales disputes required proving who reserved stock first.

### Consensus Forecast
- **English**: Consensus forecast is the agreed demand number after statistical baseline and cross-functional adjustments in S&OP or IBP.
- **中文**: 共识预测是 S&OP 或 IBP 中统计基准经跨职能调整后达成一致的需求数字。
- **30s script**: The consensus step was where sales, marketing, and supply chain signed one number. Our workflow captured comments per SKU and froze the consensus into MPS drivers. I tell Danone interviewers that technology did not replace judgment — it made judgment visible and versioned.

---

## 4. 优化与求解 (Optimization & Solving) — 12 terms

### CPLEX
- **English**: CPLEX is IBM's commercial mathematical optimization solver widely used for large-scale LP and MILP models in supply chain planning.
- **中文**: CPLEX 是 IBM 商用数学优化求解器，广泛用于供应链计划中的大规模 LP 与 MILP 模型。
- **30s script**: We integrated CPLEX as an optional engine behind APS re-sequencing and capacity leveling jobs. My role was runtime wiring — license servers, model submission, timeout handling, and surfacing infeasibility back to planners — not proving theorems. When a Panasonic line needed overnight batch optimization, CPLEX ran the MILP while the UI polled job status.

### Gurobi
- **English**: Gurobi is a high-performance optimization solver commonly paired with APS platforms for scheduling and network design problems.
- **中文**: Gurobi 是高性能优化求解器，常与 APS 平台配合解决排程与网络设计问题。
- **30s script**: Some deployments preferred Gurobi for faster root relaxation on scheduling MILPs. I abstracted solver choice so the same model definition could target CPLEX or Gurobi via configuration — useful when client IT standardized on one vendor. Interview honesty: I integrated and tuned runs; OR scientists owned the constraint math.

### MILP (Mixed Integer Linear Programming)
- **English**: MILP optimizes a linear objective subject to linear constraints where some decision variables must be integers, such as batch yes/no choices.
- **中文**: MILP 在线性约束下优化线性目标，部分决策变量必须为整数，如批次开/关选择。
- **30s script**: Sequence-dependent setup scheduling often becomes MILP — binary variables for job order. Our APS called the solver when heuristics alone could not resolve overload on **【填入真实数字】** operations. I explain MILP at interview level: objective, constraints, integrality — and that runtime explodes so production systems use time limits and fall back to heuristics.

### LP (Linear Programming)
- **English**: LP optimizes a linear objective function subject to linear equality and inequality constraints with continuous variables.
- **中文**: LP 在连续变量下，于线性等式与不等式约束中优化线性目标函数。
- **30s script**: Distribution network and rough capacity balance models were often pure LP — fast, no integers. LP relaxation also provided lower bounds for MILP scheduling runs. I mention LP when distinguishing quick S&OP feasibility from shop-floor sequencing complexity.

### Heuristic
- **English**: A heuristic is a practical rule or algorithm that finds good feasible schedules quickly without guaranteeing global optimality.
- **中文**: 启发式是用实用规则或算法快速找到可行的好排程，不保证全局最优。
- **30s script**: Most intraday APS edits used heuristics — earliest due date, shortest setup, slack-based priority — because planners needed answers in seconds. Overnight jobs could invoke MILP. I built the Pixi drag-drop to re-run local heuristics for conflict preview before commit.

### Metaheuristic
- **English**: Metaheuristics such as simulated annealing or genetic algorithms explore large solution spaces for complex scheduling or routing problems.
- **中文**: 元启发式（如模拟退火、遗传算法）在复杂排程或路径问题中探索巨大解空间。
- **30s script**: When explicit MILP models grew too large for beverage lines with hundreds of SKUs, consultants experimented with metaheuristics. I integrated their libraries behind the same job API as CPLEX. Interview frame: metaheuristics trade optimality proof for scale and speed on messy real-world instances.

### ORM (Optimization Reference Model)
- **English**: An optimization reference model is a configurable template — objectives, constraints, horizons — that maps business planning scenarios to solver-ready formulations.
- **中文**: 优化参考模型是可配置模板（目标、约束、视野），将业务计划场景映射为求解器可用 formulation。
- **30s script**: Enterprise SCP products expose ORM layers so consultants configure models without rewriting Java for each client. I maintained the mapping from UI knobs — minimize lateness, cap overtime — to solver parameters. That separation is how Panasonic could tune weights without redeploying front-end code.

### Constraint Programming
- **English**: Constraint programming defines feasible solutions via logical constraints and domain rules, effective for scheduling with complex disjunctive relations.
- **中文**: 约束编程通过逻辑约束与域规则定义可行解，适用于含复杂析取关系的排程。
- **30s script**: Some routing and crew-rostering prototypes used CP instead of MILP because disjunctive "either machine A or B" modeled naturally. I compare CP and MILP in interviews as toolkit choices — CP for expressive logic, MILP for mature LP relaxations and proven solvers.

### Branch and Bound
- **English**: Branch and bound systematically partitions integer programming search space to find optimal or bounded-suboptimal MILP solutions.
- **中文**: 分支定界系统划分整数规划搜索空间，以求解 MILP 最优或有界次优解。
- **30s script**: I do not implement branch-and-bound myself — CPLEX and Gurobi do — but I explain it when hiring managers ask why solver jobs stop at time limit with a gap percentage. That gap is the difference between incumbent schedule and bound from LP relaxation.

### Objective Function
- **English**: The objective function is the quantitative goal — minimize lateness, cost, or changeovers — that an optimization model seeks to improve.
- **中文**: 目标函数是优化模型要改进的量化目标，如最小化延迟、成本或换型次数。
- **30s script**: APS projects failed when planners and IT disagreed on the objective — minimize makespan versus maximize utilization. We exposed weighted multi-objectives in ORM config with sensible defaults per industry. I facilitated workshops where operations picked weights, engineering encoded them, planners validated outputs.

### Decision Variable
- **English**: Decision variables represent choices the optimizer makes — start times, batch sizes, assignment flags — within allowed domains.
- **中文**: 决策变量表示优化器在允许域内做出的选择，如开工时间、批量、分配标志。
- **30s script**: When debugging solver results, I traced odd schedules to wrong variable bounds — an operation scheduled on a Sunday because calendar constraints were missing. Interview tip: variables are the vocabulary of OR; constraints are grammar; objective is intent.

### Solver Integration
- **English**: Solver integration connects planning applications to optimization engines via model generation, job orchestration, and result parsing pipelines.
- **中文**: 求解器集成通过模型生成、作业编排与结果解析管道，将计划应用与优化引擎连接。
- **30s script**: My tangible OR contribution is solver integration — Dockerized worker nodes, license checkout, model JSON from APS snapshots, and writing Gantt updates back when jobs succeed. For airline crew rostering and factory APS alike, the pattern was identical even when the math differed.

---

## 5. 行业与系统 (Industry & Systems) — 12 terms

### SCP (Supply Chain Planning)
- **English**: SCP software spans demand, inventory, production, and distribution planning modules that sit above ERP execution systems.
- **中文**: SCP 软件涵盖需求、库存、生产与配送计划模块，位于 ERP 执行系统之上。
- **30s script**: My career centered on enterprise SCP — not moving boxes, but deciding what to make, buy, and ship when. Deliveries included Panasonic, Danone, and Hisense on-premise suites with MRP, APS, and S&OP modules. I position SCP as the planning brain; ERP and MES are the muscle.

### MES (Manufacturing Execution System)
- **English**: MES tracks shop-floor execution — starts, stops, yields — and feeds actuals back to planning and quality systems.
- **中文**: MES 跟踪车间执行（开工、停工、产出）并将实绩反馈给计划与质量系统。
- **30s script**: APS schedules meant little without MES feedback on Hisense lines. We integrated operation start confirmations to auto-update percent complete on the Gantt. Closed-loop stories — plan versus actual variance — show hiring managers I understand execution, not just pretty charts.

### WMS (Warehouse Management System)
- **English**: WMS manages warehouse tasks — receiving, putaway, picking — and provides inventory accuracy for DRP and ATP.
- **中文**: WMS 管理收货、上架、拣货等仓储作业，为 DRP 与 ATP 提供库存准确性。
- **30s script**: DRP and ATP depend on WMS on-hand truth. I built interfaces that reconciled planning allocations with WMS available-to-pick quantities. When discrepancies exceeded **【填入真实数字】** units, planners got exceptions before promising customer orders.

### IBP (Integrated Business Planning)
- **English**: IBP extends S&OP into finance-aligned, scenario-driven planning across product, demand, supply, and P&L on one platform.
- **中文**: IBP 将 S&OP 扩展为在产品、需求、供应与损益同一平台上的财务对齐、场景驱动计划。
- **30s script**: IBP is the SAP-marketing evolution of S&OP — same rhythm, tighter finance linkage. I map our S&OP module features to IBP language when talking to companies on SAP stacks. Scenario compare — base versus promotion upside — was the demo executives remembered.

### ROS (Route Optimization System)
- **English**: A route optimization system plans vehicle routes and stops to minimize cost or time subject to capacity and time-window constraints.
- **中文**: 路线优化系统在给定容量与时间窗约束下规划车辆路线与停靠点，以最小化成本或时间。
- **30s script**: Danone's ROS project was my route-optimization exposure — daily delivery routes with time windows and vehicle capacities. Front-end work included map visualization and dispatcher overrides when drivers called in sick. I connect ROS to the same OR integration patterns as factory APS but with geo instead of Gantt.

### Crew Rostering
- **English**: Crew rostering assigns staff to shifts and duties under labor rules, qualifications, and coverage requirements using optimization.
- **中文**: 机组/人员排班在劳动规则、资质与覆盖要求下，用优化分配员工至班次与岗位。
- **30s script**: Airline crew rostering is APS's cousin — binary assignment variables, hard legal constraints, soft preference costs. I reference rostering when interviewers ask if scheduling experience transfers outside factories. The UI patterns — feasibility explain, manual swap, re-solve — mirror production APS dispatch tools I built.

### Micro-frontend (SCP Context)
- **English**: In SCP products, micro-frontends isolate planning domains — MPS, Gantt, S&OP — into deployable apps sharing shell auth and design tokens.
- **中文**: 在 SCP 产品中，微前端将 MPS、甘特、S&OP 等计划域拆为可独立部署应用，共享壳层认证与设计规范。
- **30s script**: Our enterprise suite used micro-frontends so Danone could upgrade the Gantt without redeploying demand planning. Shared component libraries carried grid and date-picker behavior; the Pixi Gantt loaded as a federated module. I discuss module federation and team ownership — classic senior front-end governance in B2B SCP.

### DFP (Demand Forecasting and Planning)
- **English**: DFP modules combine statistical forecasting, planner collaboration, and demand signal management feeding MPS and S&OP.
- **中文**: DFP 模块整合统计预测、计划员协作与需求信号管理，为 MPS 与 S&OP 供数。
- **30s script**: DFP was the upstream sibling to APS in our product map. I wired forecast versions to MPS buckets and built override workflows with audit. Selling the story: bad DFP poisons entire SCP — garbage forecast, garbage MRP — so UX for planner judgment matters.

### S&OE (Sales and Operations Execution)
- **English**: S&OE monitors daily deviations from the S&OP plan and triggers short-term corrective actions across supply and demand.
- **中文**: S&OE 监控日常偏离 S&OP 计划的情况，并触发供需短期纠正措施。
- **30s script**: S&OE dashboards compared actual shipments and production versus consensus weekly. Alerts fed backlog reallocation and short-term overtime approvals. I position S&OE as the bridge between monthly S&OP and daily APS dispatch — where demand sensing often lives.

### ERP Integration
- **English**: ERP integration exchanges master data, orders, and inventory between planning systems and transactional systems of record.
- **中文**: ERP 集成在计划系统与事务性记录系统间交换主数据、订单与库存。
- **30s script**: Every go-live hinged on ERP integration — BOM sync, PO release, inventory snapshot. Panasonic used idempotent APIs with reconciliation jobs when netsplit failed overnight. I can talk middleware, error queues, and planner-facing sync status without claiming I am an SAP functional consultant.

### Master Data Management
- **English**: Master data management ensures items, BOMs, routings, and calendars are consistent and governed across planning and execution systems.
- **中文**: 主数据管理确保物料、BOM、工艺路线与日历在计划与执行系统间一致且受治理。
- **30s script**: APS go-lives stalled on bad routings more often than bad code. We built MDM validation gates — missing setup time blocks scheduling publish. I tell interviewers master data is the unglamorous foundation of SCP credibility; my job included making gaps visible early.

### Digital Twin (Supply Chain)
- **English**: A supply chain digital twin is a synchronized model of network, capacity, and policies used to simulate scenarios before executing changes.
- **中文**: 供应链数字孪生是网络、产能与策略的同步模型，用于在执行变更前仿真场景。
- **30s script**: We pitched what-if sandboxes as lightweight digital twins — same BOM and routes, hypothetical demand or downtime. Planners duplicated scenarios without touching production plans. I avoid buzzword overload: twin means governed mirror data plus fast simulation, not necessarily 3D factory graphics.

---

## 6. TOC / 叙事 (Theory of Constraints & Narrative) — 15 terms

### TOC (Theory of Constraints)
- **English**: TOC is a management philosophy that focuses improvement on the system constraint that limits goal achievement.
- **中文**: TOC 是一种管理哲学，将改进聚焦在限制目标实现的系统约束上。
- **30s script**: I use TOC in interviews to show operations thinking beyond coding. After reading *The Goal* and delivering APS on bottleneck lines, I connect TOC's five steps to features we built — identify constraint work centers, exploit with finite scheduling, subordinate material release. It complements OR without replacing solver math.

### Constraint (TOC)
- **English**: In TOC, the constraint is the resource or policy that limits throughput of the entire system at a given time.
- **中文**: 在 TOC 中，约束是在给定时刻限制整个系统产出的资源或政策。
- **30s script**: On a filling line for a beverage client, the constraint was not packaging — it was CIP cleaning capacity. APS marked it as drum; MRP subordinated component releases to that rhythm. I tell this story to show I diagnose where the system actually binds, not where spreadsheets assume.

### Throughput (TOC)
- **English**: Throughput is the rate at which the system generates money through sales, limited by the constraint's effective capacity.
- **中文**: 产出率（TOC）是系统通过销售创收的速率，受约束的有效产能限制。
- **30s script**: TOC throughput is revenue minus truly variable cost — not utilization vanity metrics. When planners maximized non-constraint utilization, WIP ballooned without more shipments. I reference throughput when explaining why our APS objective could weight constraint utilization differently from auxiliary lines.

### Drum-Buffer-Rope (DBR)
- **English**: DBR synchronizes the system to the constraint drum pace, with time buffers protecting throughput and rope controlling release.
- **中文**: DBR 以约束鼓点同步系统，用时间缓冲保护产出，用绳子控制投料释放。
- **30s script**: DBR maps cleanly to APS features — constraint schedule sets the drum, time buffers before assembly, rope implemented as release windows from MRP. I do not claim we branded it DBR for Panasonic, but the mechanics were the same when protecting the bottleneck filling line.

### Bottleneck (TOC)
- **English**: The bottleneck is the constraint resource with the least capacity relative to demand placed on it in the current product mix.
- **中文**: 瓶颈是当前产品组合下，相对所承受需求产能最小的约束资源。
- **30s script**: TOC bottlenecks move when mix shifts — summer promo SKUs can move constraint from filler to labeler. Our load reports highlighted shifting bottlenecks weekly. Narrative for interviews: static bottleneck master data dies quickly; planning systems must re-identify constraints.

### Five Focusing Steps
- **English**: The five focusing steps are identify, exploit, subordinate, elevate, and avoid inertia — TOC's loop for constraint management.
- **中文**: 五聚焦步骤为识别、挖尽、服从、提升、防止惰性，是 TOC 约束管理循环。
- **30s script**: I memorize the five steps for behavioral interviews. Identify — RCCP flagged the constraint; exploit — finite schedule with no idle time on drum; subordinate — rope releases components; elevate — capital project if still insufficient; inertia — revisit when mix changes. It is a structured story for leadership questions.

### Exploit the Constraint
- **English**: Exploiting the constraint means maximizing effective use of the bottleneck without wasting its scarce capacity.
- **中文**: 挖尽约束指在不浪费瓶颈稀缺产能的前提下，最大化其有效利用。
- **30s script**: Exploit meant zero changeover waste on the drum — sequence optimization in APS prioritized constraint-friendly batches. Non-value meetings stealing maintenance windows were operational issues we surfaced in red on the capacity chart. Good SCP supports exploit decisions with data.

### Subordinate Everything Else
- **English**: Subordination aligns all non-constraint decisions to support the constraint schedule rather than optimizing locally.
- **中文**: 服从约束指让所有非约束决策配合约束排程，而非局部各自优化。
- **30s script**: Upstream MRP released kits to arrive just before drum need — not early, which would pile WIP. I explain subordination to engineers tempted to max every machine's utilization. APS pegging and rope parameters encoded subordination without planners memorizing TOC vocabulary.

### Elevate the Constraint
- **English**: Elevating the constraint adds capacity — equipment, shifts, outsourcing — when exploit and subordinate are insufficient.
- **中文**: 提升约束是在挖尽与服从仍不足时，增加产能（设备、班次、外包）。
- **30s script**: S&OP scenarios modeled elevation — add shift, parallel line, outsource filling — with **【填入真实数字】** capex placeholders. When elevation broke the old bottleneck, we re-ran RCCP because a new constraint emerged. That loop mirrors the fifth focusing step about inertia.

### Utilization vs. Activation
- **English**: TOC distinguishes useful utilization of the constraint from busy-but-unproductive activation on non-constraints.
- **中文**: TOC 区分约束的有效利用与非约束上忙碌却无产出的激活。
- **30s script**: Interview anecdote: a packaging line ran overtime while orders shipped late because filling was idle due to component starvation. Local activation masked system throughput loss. APS and pegging made starvation visible before overtime spend.

### Inventory Buffer (TOC)
- **English**: TOC inventory buffers protect the constraint from upstream variability without drowning the system in excess WIP.
- **中文**: TOC 库存缓冲保护约束免受上游波动影响，又避免系统陷入过量在制品。
- **30s script**: Strategic buffers sat before the drum — not everywhere. MRP safety stock rules implemented buffer sizing with time-based targets. I contrast TOC buffers with blanket safety stock increases that finance rejected at Danone inventory reviews.

### Time Buffer
- **English**: A time buffer is planned slack before a constraint or customer due date to absorb variability without missing schedule.
- **中文**: 时间缓冲是在约束或客户交期前的计划余量，用于吸收波动而不误期。
- **30s script**: Time buffers appeared in DBR rope calculations and in airline-style project planning modules. Shrinking buffers improved cash but increased lateness risk — we showed trade curves in S&OP. Placeholders **【填入真实数字】** days of buffer when telling war stories.

### WIP (Work in Process)
- **English**: WIP is partially finished goods between operations; excessive WIP often signals imbalance and hides bottlenecks.
- **中文**: 在制品是工序间半成品；过量 WIP 常表明失衡并掩盖瓶颈。
- **30s script**: High WIP between assembly and test at an appliance plant meant rope was too loose. APS WIP limits and kanban signals were the technical response; TOC explained why finance cared. I use WIP to link shop-floor visuals to planning policy in narrative interviews.

### Flow
- **English**: Flow is the smooth movement of material and information toward customer delivery with minimal stops and rework.
- **中文**: 流动是物料与信息顺畅地流向客户交付，停顿与返工最少。
- **30s script**: *The Goal* framed flow over local efficiency — still relevant when designing APS objectives. I mention flow when discussing why we penalized unnecessary splits that created WIP queues. Hiring managers in manufacturing recognize the language instantly.

### Takt Time
- **English**: Takt time sets the production pace needed to match customer demand rate for a given period.
- **中文**: 节拍时间设定给定期间内匹配客户需求速率所需的生产节奏。
- **30s script**: Takt linked MPS volume to available constraint minutes — if takt tightened during promo season, RCCP flagged overload early. On Hisense lines we displayed takt versus actual on Andon-style dashboards fed from MES. Simple formula, powerful alignment between sales and production.
