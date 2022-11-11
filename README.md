# js-table
Javascript generated table
In HTML doc, set table id and enter header cells of your choosing. 
Example:
<table id="search-result" class="display">
        <thead>
            <tr>
                <th>Title</th>
                <th>Episode</th>
                <th>Season</th>
                <th>Channel</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
In Javascript file create new Table object and pass as its parameters: 1.) id 2.) data object.
Example:
const t = new Table("search-result", sample);
Create table with init() method.
Example:
t.init();
