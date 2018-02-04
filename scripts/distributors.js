$( document ).ready(() => {
    $("#distributors").load("html/searchBar.html"); 
});

function searchDistributors(event) {
    event.preventDefault()
    $("#searchBar").addClass("hidden");

    const test = `
    <div id="distributor-items">
    <ul id="check-list-box" class="list-group checked-list-box">
    <li class="list-group-item" data-color="success">Dapibus ac facilisis in</li>
    <li class="list-group-item" data-color="success">Dapibus ac facilisis in</li>
    <li class="list-group-item" data-color="success">Dapibus ac facilisis in</li>
    <li class="list-group-item" data-color="success">Dapibus ac facilisis in</li>
      <li class="list-group-item" data-color="success">Dapibus ac facilisis in</li>
    </ul>
    </br>
    <button class="btn btn-primary col-xs-12" id="get-checked-data">Get Checked Data</button>
    </div>
    `;

    $("#distributors").append(test);
    addAndStyleCheckboxes();
    $("#get-checked-data").on('click', submitDeliveredItems);
}

function submitDeliveredItems(event) {
    $("#check-list-box li.item-delivered").each(function(idx, li) {
        console.log($(li).text());
    });
    $("#distributor-items").remove();
    $("#searchBar").removeClass("hidden");
}

function addAndStyleCheckboxes() {

    $('.list-group.checked-list-box .list-group-item').each(function () {
    
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + " item-delivered");
            } else {
                $widget.removeClass(style + color + " item-delivered");
            }
        }
        
        updateDisplay();
        // Inject the icon if applicable
        if ($widget.find('.state-icon').length == 0) {
            $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
        }
    });
}