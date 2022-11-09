const Table = function(id, tableData) {
    this.id = id
    this.tableContainer = document.getElementById(this.id)
    this.data = tableData
    this.dataLen = this.data.length
    this.listenerStore = []
    this.refresh = false
    this.classLen = 0
    this.paginCLen = 6
}

Table.prototype.onSelect = function() {
    this.refreshTable()
}

Table.prototype.createSelect = function() {
    let select =
        '<select id="show-entries">\n' +
        '<option value="10" selected>10</option>\n' +
        '<option value="25">25</option>\n' +
        '<option value="50">50</option>\n' +
        '<option value="100">100</option>\n' +
        '</select>\n' +
        ' entries'
    let label = document.createElement('LABEL')
    label.setAttribute('for', 'entries-select')
    label.setAttribute('id', 'entries-select')
    label.innerHTML = 'Show ' + select
    this.tableContainer.parentNode.insertBefore(label, this.tableContainer)
        //create event listener
    let x = document.getElementById('show-entries')
    let listener = this.onSelect.bind(this)
    x.addEventListener('change', listener, false)
}

Table.prototype.addRow = function(className, data) {
    let tBody = document.querySelector(`#${this.id} > tbody`)
    let r = document.createElement('TR')
    r.setAttribute('class', className)
    tBody.appendChild(r)
    for (let [key, value] of Object.entries(data)) {
        let t = document.createElement('TD')
        t.setAttribute('class', `col-${key}`)
        t.innerHTML = value
        r.appendChild(t)
    }
}

Table.prototype.on = function(ev, f) {
    if (!this.refresh) this.listenerStore.push({ event: ev, func: f })
    for (let i = 1; i < this.tableContainer.rows.length; i++) {
        for (let j = 0; j < this.tableContainer.rows[i].cells.length; j++) {
            this.tableContainer.rows[i].cells[j].addEventListener(ev, f, false)
        }
    }
}

Table.prototype.populateTable = function() {
    let shownEntries = document.getElementById('show-entries').value
    let quotient = Math.trunc(this.dataLen / shownEntries)
    let remainder = this.dataLen % shownEntries
    let containers
    quotient <= 1 ? (containers = 1) : (containers = quotient)
    if (remainder > 0 && quotient != 0) containers++
        let count = 0
    this.classLen = containers
    for (let i = 0; i < containers; i++) {
        let size = shownEntries
        if (i === containers - 1 && remainder !== 0) size = remainder
        for (let j = 0; j < size; j++, count++) {
            i > 0 ?
                this.addRow(`tr-container${i + 1} hidden`, this.data[count]) :
                this.addRow(`tr-container${i + 1}`, this.data[count])
        }
    }
}

Table.prototype.createInfo = function() {
    let div = document.createElement('DIV')
    div.setAttribute('id', 'dspl_info')
    div.setAttribute('class', 'table-info')
    div.style.display = 'inline-block'
    this.tableContainer.parentNode.insertBefore(
        div,
        this.tableContainer.nextSibling
    )
}

Table.prototype.displayInfo = function() {
    let c = parseInt(document.querySelector('#pagination > a.active').innerHTML)
    let multiplier = parseInt(document.getElementById('show-entries').value)
    let endRange = c * multiplier
    document.getElementById('dspl_info').innerHTML = `Showing ${
      endRange - multiplier
    } to ${endRange > this.dataLen ? (endRange = this.dataLen) : endRange} of ${
      this.dataLen
    } entries`
}

Table.prototype.addPagnButton = function(className, data, size, last) {
    let div = document.getElementById('pagination')
    if (data != 1 && data % size === 1) {
        let larrow = document.createElement('A')
        larrow.setAttribute('class', className)
        larrow.setAttribute('href', '#')
        larrow.setAttribute('data-', 'left-arrow')
        larrow.innerHTML = '&laquo;'
        div.appendChild(larrow)
    }
    let a = document.createElement('A')
    a.setAttribute('class', className)
    if (data === 1) a.classList.add('active')
    a.setAttribute('href', '#')
    a.innerHTML = data
    div.appendChild(a)
    if (data % size === 0 && !last) {
        let rarrow = document.createElement('A')
        rarrow.setAttribute('class', className)
        rarrow.setAttribute('href', '#')
        rarrow.setAttribute('data-', 'right-arrow')
        rarrow.innerHTML = '&raquo;'
        div.appendChild(rarrow)
    }
}

Table.prototype.addPagination = function() {
    let div = document.createElement('DIV')
    div.setAttribute('id', 'pagination')
    div.setAttribute('class', 'pagination')
    document
        .getElementById('dspl_info')
        .parentNode.insertBefore(
            div,
            document.getElementById('dspl_info').nextSibling
        )
    let pgnBtQuotient = Math.trunc(this.classLen / this.paginCLen) // class size / length pf pagination container
    let pgnBtRemainder = this.classLen % this.paginCLen
    let pgBtContainers
    pgnBtQuotient <= 1 ? (pgBtContainers = 1) : (pgBtContainers = pgnBtQuotient)
    if (pgnBtRemainder > 0 && pgnBtQuotient != 0) pgBtContainers++
        let count = 1
    for (let i = 0; i < pgBtContainers; i++) {
        let size = this.paginCLen
        if (i === pgBtContainers - 1 && pgnBtRemainder !== 0) size = pgnBtRemainder
        for (let j = 0; j < size; j++, count++) {
            if (i > 0) {
                this.addPagnButton(`pgn-${i + 1} hidden`, count, this.paginCLen)
            } else if (i === pgBtContainers - 1) {
                this.addPagnButton(`pgn-${i + 1}`, count, this.paginCLen, 'last')
            } else {
                this.addPagnButton(`pgn-${i + 1}`, count, this.paginCLen)
            }
        }
    }
}

Table.prototype.addPaginationListener = function() {
    let prevTrClass = this.tableContainer.rows[1].classList.item(0)
    let showInfo = this.displayInfo.bind(this)

    function btnListener(t) {
        let prevButton = prevTrClass.match(/\d+/)
        let aTags = document.getElementById('pagination').getElementsByTagName('a')
        for (let i = 0; i < aTags.length; i++) {
            if (aTags[i].innerHTML === prevButton[0])
                aTags[i].classList.remove('active')
        }
        t.classList.add('active')

        let currentTrClass = `tr-container${t.innerHTML}`
        if (currentTrClass != prevTrClass) {
            let currentTrList = document.getElementsByClassName(currentTrClass)
            let prevTrList = document.getElementsByClassName(prevTrClass)
            for (let i = 0; i < prevTrList.length; i++) {
                prevTrList[i].classList.add('hidden')
            }
            for (let i = 0; i < currentTrList.length; i++) {
                currentTrList[i].classList.remove('hidden')
            }
            prevTrClass = currentTrClass
        }
        showInfo()
    }

    function togglePgn(clicked) {
        let currentClass = clicked.classList.item(0) // class of clicked arrow
        let list = document.getElementsByClassName(currentClass)
        for (let i = 0; i < list.length; i++) {
            list[i].classList.add('hidden') // remove the class
            if (list[i].classList.contains('active'))
                list[i].classList.remove('active')
        }
        return currentClass
    }

    function toggleRows(landing) {
        let landingTrClass = `tr-container${landing}`
        let landingTrList = document.getElementsByClassName(landingTrClass)
        let prevTrList = document.getElementsByClassName(prevTrClass)
        for (let i = 0; i < prevTrList.length; i++) {
            prevTrList[i].classList.add('hidden')
        }
        for (let i = 0; i < landingTrList.length; i++) {
            landingTrList[i].classList.remove('hidden')
        }
        prevTrClass = landingTrClass
    }

    function rightArrBtnListener(t) {
        let currentClass = togglePgn(t)
        let nextClass = `pgn-${parseInt(currentClass.charAt(4)) + 1}` // next btn class +1
        let nextList = document.getElementsByClassName(nextClass)
        for (let i = 0; i < nextList.length; i++) {
            if (i === 1) nextList[i].classList.add('active')
            nextList[i].classList.remove('hidden') // display the class
        }
        let landingButton = nextList[1].innerHTML
        toggleRows(landingButton)
        showInfo()
    }

    function leftArrBtnListener(t) {
        let currentClass = togglePgn(t)
        let prevClass = `pgn-${parseInt(currentClass.charAt(4)) - 1}` // clicked btn class -1
        let prevList = document.getElementsByClassName(prevClass)
        for (let i = 0; i < prevList.length; i++) {
            if (i === prevList.length - 2) prevList[i].classList.add('active')
            prevList[i].classList.remove('hidden')
        }
        let landingButton = prevList[prevList.length - 2].innerHTML
        toggleRows(landingButton)
        showInfo()
    }

    let p = document.getElementById('pagination')
    let elA = p.getElementsByTagName('A')
    for (let i = 0; i < elA.length; i++) {
        if (elA[i].getAttribute('data-') === 'right-arrow') {
            elA[i].addEventListener('click', function() {
                rightArrBtnListener(this)
            })
        } else if (elA[i].getAttribute('data-') === 'left-arrow') {
            elA[i].addEventListener('click', function() {
                leftArrBtnListener(this)
            })
        } else {
            elA[i].addEventListener('click', function() {
                btnListener(this)
            })
        }
    }
}

Table.prototype.refreshTable = function() {
    let tBody = document.querySelector(`#${this.id} > tbody`)
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild)
    }
    document.getElementById('pagination').remove()
    document.getElementById('dspl_info').remove()
    this.populateTable()
    this.createInfo()
    this.addPagination()
    this.addPaginationListener()
    this.displayInfo()

    if (this.listenerStore.length !== 0) {
        this.refresh = true
        for (let i = 0; i < this.listenerStore.length; i++) {
            this.on(this.listenerStore[i].event, this.listenerStore[i].func)
        }
    }
}

Table.prototype.destroy = function() {
    let s = document.getElementById('entries-select')
    if (s) s.remove()
    let tBody = document.querySelector(`#${this.id} > tbody`)
    if (tBody) {
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild)
        }
    }
    let p = document.getElementById('pagination')
    if (p) p.remove()
    let d = document.getElementById('dspl_info')
    if (d) d.remove()
}

Table.prototype.init = function() {
    this.destroy()
    this.createSelect()
    this.populateTable()
    this.createInfo()
    this.addPagination()
    this.addPaginationListener()
    this.displayInfo()
}