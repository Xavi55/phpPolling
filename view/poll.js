window.onload=()=>
{
  loadPoll();

  //testing
  //$('.btn-group button').removeClass('admin');
};

function loadPoll()
{
  $.get('../index.php',{action:'load'},data=>
  {
    data=JSON.parse(data);
    $('#selection').html('');
    for(let i in data['candidates'])
    {
      if(i==='total') continue;
      render(i);
    }

  });
}

render=(person)=>
{
  $('#selection').append(`
      <div class="col-sm-4 col-md-4" id="${person}">
          <div class="thumbnail">
            <span class="close admin" onclick=delPerson("${person}")>×</span>
            <div class="caption">
              <h3 class="center person">${person}</h3>
              <p class=center><a href="#/" class="btn btn-default" onclick=pick("${person}")>Vote</a></p>
            </div>
          </div>
        </div>`);
}

pick=(person)=>
{
  $('.caption a').removeClass('btn-primary');
  $('.caption h3').removeClass('vote');

  $(`#${person} a`).addClass('btn-primary');
  $(`#${person} h3`).addClass('vote');

}

login=()=>
{
  let pass=$('#pass').val();
  $.post('../index.php',{action:"login","pass":pass},data=>
  {
    if(data)
    {
      $('.close').removeClass('admin');
      $('.btn-group button').removeClass('admin');
      $('#pass').val('');
      alert('save after editing.');
    }
  });
}

submit=()=>
{
  let person=$(`.vote`).text();
  if(person.length!=0)
  {
    $.post('../index.php',{action:"submit","add":person},data=>
    {
      if(data.length!=0)
      {
        try 
        {
          makeChart(JSON.parse(data));
        } 
        catch(error) 
        {
          console.log('unable to render chart::',error);  
        }
      }
    });
  }
  else
  {
    alert('No selection');
  }
}

makeChart=(poll)=>
{
  $('#result h4').text('Total Votes: '+poll['total']);
  $('#result').removeClass('admin');
  $('#selection').addClass('admin');
  $('.btn-group').addClass('admin');

  let x=$('#chart');
  var myChart = new Chart(x, {
    type: 'horizontalBar',
    data: {
        labels: Object.keys(poll['candidates']),
        datasets: [{
            label: '# of Votes',
            data: Object.values(poll['candidates']),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes:[{
              ticks:{
                beginAtZero:true
              }
            }]
          }
        }
    });
}

newEntry=()=>
{
  $('#selection').append(`
      <div class="col-sm-4 col-md-4 temp">
          <div class="thumbnail">
            <div class="caption">
             <input type="text" class="form-control add" placeholder="New Entry...">
            </div>
          </div>
        </div>`);
}

newPoll=()=>
{
  let entries = document.getElementsByClassName('add');
  if(entries.length!=0)
  {
    for(let i=0; i<entries.length;i++)
    {
      if(entries[i].value)
      {
        render(entries[i].value);
      }
    }
  $('.temp ').remove();
  //add new candidates with the 'add' className
  ///
  //
  //$('.btn-group button').addClass('admin');
  }
  candidates=document.getElementsByClassName('person');

  let newPoll={'total':0,'candidates':{}};
  for(let i=0; i<candidates.length;i++)
  {
    newPoll['candidates'][candidates[i].innerHTML]=0;
  }
  $.post('../index.php',{action:"new","data":newPoll},data=>
  {
    if(data)
      $('.btn-group .btn-default').addClass('admin');
      $('.close').addClass('admin');
  });
}

delPerson=(person)=>
{
  console.log('remove');
  $(`#${person}`).remove();
}