class Scatterplot {
    margin = {
        top: 10, right: 100, bottom: 40, left: 160
    }

    constructor(svg, data, width = 250, height = 250) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;

        this.handlers = {};
        this.timeFormat = d3.timeFormat("%Y/%m/%d %H:%M:%S");
    }

    setData(data) {
        this.data = data;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");

        this.xScale = d3.scaleTime();
        this.yScale = d3.scaleBand()
            .domain(this.data.map(d => d["screen"]))
            .range([this.height, 0])
            .padding(0.1);
        this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(xVar, yVar, colorVar) {
        let fullFormat = d3.timeFormat("%Y/%m/%d %H:%M:%S");
        let timeFormat = d3.timeFormat("%H:%M:%S");

        this.xVar = xVar;
        this.yVar = yVar;

        this.xScale.domain(d3.extent(this.data, d => new Date(d[xVar]))).range([0, this.width]);
        this.yScale = d3.scaleBand()
            .domain(this.data.map(d => d["screen"]))
            .range([this.height, 0])
            .padding(0.1);
        this.zScale.domain([...new Set(this.data.map(d => d[colorVar]))])

        this.circles = this.container.selectAll("circle")
            .data(data)
            .join("circle");

        this.circles
            .transition()
            .attr("cx", d => this.xScale(d[xVar]))
            .attr("cy", d => this.yScale(d[yVar]) + this.yScale.bandwidth() / 2)           
            .attr("fill", d => this.zScale(d[colorVar]))
            .attr("r", 3)

        this.circles.on("mouseover", function(event, d) {
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            tooltip.html("UserID: " + d.user_pseudo_id + "<br/>" +
                    "Screen: " + d.screen + "<br/>" +
                    "Event: " + d.event_name + "<br/>" +
                    "Time: " + fullFormat(d.event_timestamp))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9);
        }).on("mouseout", function(d) {
            d3.select(".tooltip").remove();
        });

        this.circles.on("click", (event, d) => this.onClickPlotHandler(d));

        let ticks = this.xScale.ticks(10);
        this.xAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisBottom(this.xScale).ticks(10).tickFormat(d => {
                if (d.getTime() === ticks[0].getTime() || d.getTime() === ticks[ticks.length - 1].getTime()) {
                    return fullFormat(d);
                } else {
                    return timeFormat(d);
                }
            }));        

        this.yAxis
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
            .transition()
            .call(d3.axisLeft(this.yScale));
    }

    onClickPlot(handler) {
        this.onClickPlotHandler = handler;
    }
}