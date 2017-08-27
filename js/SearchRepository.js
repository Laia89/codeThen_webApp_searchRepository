
$('.nextPrev a').off('click').on('click', function() {
  var url = $(this).data();
  getDataFromUrl(url);
})

$('#searchRepoBtn, .result input[name="order"]').off('click').on('click', function() {
  const searchTerm = $('#searchRepoInput').val();
  if (searchTerm) {
    const order = $('.result input[name="order"]:checked').val();
    //$.when(getRepoData(searchTerm, order)).then((data) => fillTable(data));
    const githubReposUrl = 'https://api.github.com/search/repositories';
    const url = githubReposUrl + '?q=' + searchTerm + '&per_page=20&order=' + order;
    getDataFromUrl(url);
  }
})


function getDataFromUrl(url) {
  $.when(doAjaxCall(url))
    .then(( xhr ) => {
      const data = JSON.parse(xhr.responseText); // converts response to JSON object
      const result = `Found ${data.total_count} repositories about ${$('#searchRepoInput').val()}`;
      $('.result span').text(result);
      setUrlInBtn(xhr.getResponseHeader('Link'));
      fillTable(data);
    },
    ( status ) => $('.result span').text(`There was an error: ${status}`));
  $('.result span').text("sending request with XMLHttpRequest...");
};

function doAjaxCall(url) {
  var $deferred = $.Deferred();
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    console.log("AJAX request finished correctly :)");
    $deferred.resolve(xhr);
  };
  xhr.onerror = () => {
    console.log("AJAX request finished with an error :(");
    $deferred.reject(xhr.statusText);
  };
  xhr.send();
  return $deferred.promise();
};

//xhr.getResponseHeader('Link') -->null (troba 1, 1 pag) , afsda

function setUrlInBtn(headerLink) {
  const headersLink = headerLink.split(', ');
  $.each(headersLink, function(i, header) {
    var start_pos = header.indexOf('<') + 1;
    var end_pos = header.indexOf('>',start_pos);
    var url = header.substring(start_pos,end_pos);
    if (header.includes('next')) {
      $('a.next').attr('data-url', url);
    } else if (header.includes('prev')) {
      $('a.previous').attr('data-url', url);
    }
  });
}

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
