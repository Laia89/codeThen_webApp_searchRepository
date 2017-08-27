
$('#searchRepoBtn, .result input[name="order"]').off('click').on('click', function() {
  const searchTerm = $('#searchRepoInput').val();
  if (searchTerm) {
    const order = $('.result input[name="order"]:checked').val();
    $.when(getRepoData(searchTerm, order)).then((data) => fillTable(data));
  }
})

// AJAX example (using XMLHttpRequest class)
function getRepoData(searchTerm, order) {
  var $deferred = $.Deferred();
  const githubReposUrl = 'https://api.github.com/search/repositories';
  const url = githubReposUrl + '?q=' + searchTerm + '&per_page=20&order=' + order;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    console.log("AJAX request finished correctly :)");
    const data = JSON.parse(xhr.responseText); // converts response to JSON object
    $deferred.resolve(data);
    const result = `Found ${data.total_count} repositories about ${searchTerm}`;
    $('.result span').text(result);
  };

  xhr.onerror = () => {
    console.log("AJAX request finished with an error :(");
    $deferred.reject(xhr.statusText);
    $('.result span').text(`There was an error: ${xhr.statusText}`);
  };
  $('.result span').text("sending request with XMLHttpRequest...");
  xhr.send();
  return $deferred.promise();
};

function fillTable(data) {
  var htmlRow = '';
  $.each(data.items, function(i, rowValues) {
    htmlRow += '<tr>' + fillRowInTable(rowValues) + '</tr>';
  });
  $('tbody').html(htmlRow);
}

function fillRowInTable(rowValues) {
  var htmlColumns = '<td>' + rowValues.id + '</td>';
      htmlColumns += '<td>' + rowValues.name + '</td>';
      htmlColumns += '<td>' + rowValues.url + '</td>';
      htmlColumns += '<td>' + rowValues.owner.login + '</td>';
  return htmlColumns;
};
