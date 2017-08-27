
$('#searchRepoBtn, .result input[name="order"]').off('click').on('click', function() {
  const searchTerm = $('#searchRepoInput').val();
  if (searchTerm) {
    const order = $('.result input[name="order"]:checked').val();
    //$.when(getRepoData(searchTerm, order)).then((data) => fillTable(data));
    initProces(searchTerm, order);
  }
})

function initProces(searchTerm, order) {
  const githubReposUrl = 'https://api.github.com/search/repositories';
  const url = githubReposUrl + '?q=' + searchTerm + '&per_page=10&order=' + order;

  $.when(getRepoData(url))
    .then(( data ) => {
      const result = `Found ${data.total_count} repositories about ${searchTerm}`;
      $('.result span').text(result);
      fillTable(data);
    },
    ( status ) => $('.result span').text(`There was an error: ${status}`));
  $('.result span').text("sending request with XMLHttpRequest...");
};

function getRepoData(url) {
  var $deferred = $.Deferred();
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    console.log("AJAX request finished correctly :)");
    const data = JSON.parse(xhr.responseText); // converts response to JSON object
    $deferred.resolve(data);
  };
  xhr.onerror = () => {
    console.log("AJAX request finished with an error :(");
    $deferred.reject(xhr.statusText);
  };
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
