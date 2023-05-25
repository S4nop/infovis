class DataTable {
    constructor(id) {
        this.id = id;
    }

    update(data, columns) {
        let table = d3.select(this.id);

        // Remove previous data
        table.html("");
        
        // Create headers
        table.append('thead').append('tr')
            .selectAll('th')
            .data(columns).enter()
            .append('th')
            .text(d => d);
        
        // Create body
        let tbody = table.append('tbody');
        
        // Create as many <tr>s as rows
        let rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');
        
        // Populate <td>s in each row
        let cells = rows.selectAll('td')
            .data(row => columns.map(column => {
                // Check if the value is an object or an array of objects
                if (typeof row[column] === 'object') {
                    // Convert the object or the array of objects to a formatted string
                    let str = JSON.stringify(row[column], null, 2);
                    // Wrap the string in <pre> tags
                    str = `<pre>${str}</pre>`;
                    return str;
                }
                return row[column];
            }))
            .enter()
            .append('td')
            .html(d => d);  // use .html() instead of .text()

        return this;
    }
}