window.onload=()=>
{
  loadPoll();
  $('.btn-group button').removeClass('admin');
};

function loadPoll()
{
  $.get('../index.php',{action:'load'},data=>
  {
    data=JSON.parse(data);
    $('#selection').html('');
    for(let i in data)
    {
      if(i==='total') continue;
      render(i);
    }

  });
}

function render(person)
{
  $('#selection').append(`
      <div class="col-sm-4 col-md-4">
          <div class="thumbnail">
            <div id="${person}" class="caption">
              <h3 class="center person">${person}</h3>
              <p class=center><a href="#/" class="btn btn-default" onclick=pick("${person}")>Vote</a></p>
            </div>
          </div>
        </div>`);
}

function pick(person)
{
  $('.caption a').removeClass('btn-primary');
  $('.caption h3').removeClass('vote');

  $(`#${person} a`).addClass('btn-primary');
  $(`#${person} h3`).addClass('vote');

}

function login()
{
  let pass=$('#pass').val();
  $.post('../index.php',{action:"login","pass":pass},data=>
  {
    if(data)
    {
      $('.btn-group button').removeClass('admin');
      alert('save after editing.');
    }
  });
}

function submit()
{
  let person=$(`.vote`).text();
  if(person.length!=0)
  {
    $.post('../index.php',{action:"submit","add":person},data=>
    {
      console.log(data);
    })
  }
  else
  {
    alert('No selection');
  }
}

function newEntry()
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

function newPoll()
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
  //send new name to php

    //$('.btn-group button').addClass('admin');
  }
  candidates=document.getElementsByClassName('person');

  let newPoll={'total':0};
  for(let i=0; i<candidates.length;i++)
  {
    newPoll[candidates[i].innerHTML]=0;
  }
  $.post('../index.php',{action:"new","data":newPoll},data=>
  {
    if(data)
      $('.btn-group .btn-default').addClass('admin');
  });
}

function delPerson(person)
{
  console.log('remove');
}