class Recipe{
    constructor(id, name, author, ingredients, directions, type, type_id, notes, images){
        this.id = id;
        this.author = author;
        this.name = name;
        this.ingredients = ingredients;
        this.directions = directions;
        this.type = type;
        this.type_id = type_id;
        this.notes = notes;
        this.images = images;
    }
}

function nl2br (str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
      return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function loadRecipe(id) {
  // drawImages();
  switchTab('recipe_link');  
  active_recipe = id;
  $('#recipe_link').removeClass('disabled');  
  var recipe = recipes[id];
  $('#recipe_title').html('<h6><i>'+recipe.type+'</i></h6><h4>'+recipe.name+'</h4><h5>by '+recipe.author+'</h5>');
  $('#ingredients').html('');
  $('#notes').html('');
  $('#ingredients').append('<li class="list-group-item"><h5 class = "list-group-item-heading">Ingredients</h5></li>');
  $.each(recipe.ingredients, function(key, val){
      $('#ingredients').append('<li class="list-group-item">'+val.ingredient+'</li>');
  });
  $('#notes').append('<li class="list-group-item"><h6 class = "list-group-item-heading">Notes</h6></li>');
  $.each(recipe.notes, function(key, val){
      $('#notes').append('<li class="list-group-item"><i>'+val+'</i></li>');
  });  
  $('#directions').html('<h4>Directions</h4>'+nl2br(recipe.directions, false));
  $('#recipe_id').val(id);
  drawImages();
}

function drawImages(id){
  var recipe = recipes[active_recipe];
  $('#show_inner').html('');
  $('#images_edit_list').html('');
  $('#images_edit_list').append(`<h5 style="text-align: left;">Delete Photos</h5>`);
  $.each(recipe.images, function(key, val){
    if (val.id != id) 
    {
      $('#images_edit_list').append(`
        <img onclick="$(this).addClass('red_image');showDelimg('`+val.filename+`',`+val.id+`,`+key+`)" class="img-thumbnail" alt="`+val.description+`" src="resources/thumb.php?image=`+val.filename+`&size=300" style="margin-bottom: 15px;" id="img`+val.id+`">
        `);
        $('#show_inner').append(`<div class="carousel-item `+(key == 0 ? 'active' : '')+`">
        <img id="carimg`+key+`" class="carousel-img" src="/images/uploads/`+val.filename+`" class="d-block" style="width:100%">
        <div class="carousel-caption">
          <p>`+val.description+`</p>
        </div>
      </div>`);
    }

  });
}


function showDelimg(url, id,key){
  var desc = recipes[active_recipe]["images"][key]["description"];
  active_img = id;
  $('#delimg_body').html(`
  <img src="resources/thumb.php?image=`+url+`&size=300" style="margin: 15px;"><br>
  <div class="form-floating mb-3 mt-3">
  <input type="text" class="form-control" id="edit_img_desc" value="`+desc+`">
  <label for="email">Description</label>
</div>
  <div class="btn-group">
    <button type="button" onclick="delImage(`+id+`)" class="btn btn-danger">Delete</button>
    <button type="button" onclick="updateImageDesc(`+id+`)" class="btn btn-primary">Save</button>
    <button type="button" onclick="$('#img`+id+`').removeClass('red_image')" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
</div>`);
  $('#delimg_modal').modal({backdrop: 'static', keyboard: false})  

  $('#delimg_modal').modal('show');

}

function delImage(id){
  var check = confirm("Are you sure you want to delete this image?");
  if (check){
    var variables = {
      "type" : "delimage",
      "id" : id
    };
    $("#delimg_modal").modal("hide");
    $.post('resources/index.php', variables, function(result){
      searchRecipes().then(drawImages(id));
    });
  }
}

function updateImageDesc(id){
  var variables = {
    "type" : "editdesc",
    "desc" : $('#edit_img_desc').val(),
    "id" : id
  };
  $("#delimg_modal").modal("hide");
  $.post('resources/index.php', variables, function(result){
    searchRecipes().then(drawImages());
  });
}

function switchTab(active){
  resetEditModal();
  switch (active){
    case 'search_link':
      $('#edit_new_button').hide();
      $('#current_recipe').hide();
      $('#close').hide();
      $('#type_menu').show();
      $('#new_button').show();
      $('#search_recipes').show();
      if ($.fn.DataTable.isDataTable('#recipes_table')){
        $('#recipes_table').DataTable().destroy();
      }
      $('#recipes_table').DataTable({
        "order": [ 0, 'asc' ],
        paging: false,
        "columnDefs": [
          { "visible": false, "targets": 1 }
        ]
      });    
      break;
    case 'recipe_link':
      $('#search_recipes').hide();
      $('#new_button').hide();
      $('#type_menu').hide();
      $('#current_recipe').show();
      $('#edit_new_button').show();
      $('#close').show();
      break;
  };
}

function getScreen(){
  var filename = $('#recipe_title h4').html().replace(/\W/g, '');
  html2canvas(document.getElementById('full_recipe')).then(function(canvas) {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = filename;
    link.href = canvas.toDataURL("image/jpeg");
    link.target = '_blank';
    link.click();
  });
}

function loadEditModal(id){
  var recipe = recipes[id];
  $('#modal_heading').html(recipe.name);
  $('#edit_name').val(recipe.name);
  $('#edit_id').val(id);
  $('#edit_author').val(recipe.author);
  $('#edit_directions').val(recipe.directions);
  $('#edit_type').val(recipe.type_id)
  $.each(recipe.ingredients, function(key, val){
    addIngredient(val.ingredient);
  });
  $('#edit_modal').modal('show');
}

function resetEditModal(){
  $('#modal_heading').html('New Recipe');
  $('#edit_name').val('');
  $('#edit_id').val('');
  $('#edit_author').val('');
  $('#edit_directions').val('');
  $('#edit_type').val(0)
  $('#edit_ingredients_span').html('');
}

function addIngredient(value = "", type = "after"){
  var html = `
  <div class="input-group mb-3">
    <div class="form-floating flex-grow-1">
        <input type="text" class="form-control recipe_ingredients" placeholder="Recipe Ingredients" value="`+value+`" autocomplete="off">
        <label for="code1">Recipe Ingredients</label>
    </div>
    <span class="input-group-text">
        <button type="button" class="btn-close" onclick="$(this).parent().parent().remove()"></button>
    </span>
  </div>
  `;
  if (type == "prepend"){
    $('#edit_ingredients_span').prepend(html);
  } else  {
    $('#edit_ingredients_span').append(html);
  }
}

function editRecipe(){
  if ([$('#edit_name').val(),$('#edit_author').val(),$('#edit_directions').val()].includes('')){
    alert('Recipe name, author, and directions must be filled out!');
  } else  {
    var vals = [];
    $('input[type="text"].recipe_ingredients').each(function () {
      vals.push($(this).val());
    });    
    var variables = {
      "type" : "edit",
      "id" : $('#edit_id').val(),
      "name" : $('#edit_name').val(),
      "author" : $('#edit_author').val(),
      "directions" : $('#edit_directions').val(),
      "type_id" : $('#edit_type').val(),
      "ingredients" : vals
    };
    $.post('resources/index.php', variables);
    location.reload();
  }
}

function delRecipe(){
  id = active_recipe;
  var check = confirm("Are you sure you want to delete the recipe "+recipes[id].name+"?");
  if (check){
    var variables = {
      "type" : "del",
      "id" : id
    };
    $.post('resources/index.php', variables);
    location.reload();   
  } 
}

function drawNotes(){
  id = active_recipe;
  $('#notes_edit_list').html('');
  $.each(recipes[id]['notes'], function(key, val){
    $('#notes_edit_list').append(`<li class="list-group-item list-group-item-action">
    <div class="input-group mb-3">
      <button class="btn btn-outline-danger" type="button" onclick="delNote(`+key+`,'`+val+`')">???????</button>
      <input type="text" class="form-control" id="note`+key+`" value="`+val+`" />
      <button class="btn btn-outline-primary" type="button" onclick="saveNote(`+key+`,$('#note`+key+`').val())">????</button>
      </div>`);
  });
  $('#notes_edit_list').append(`<li class="list-group-item list-group-item-action">
  <div class="input-group mb-3">
      <span class="input-group-text">Add Note</span>
    <input type="text" class="form-control" id="new_note" value="" placeholder="New Recipe Type" />
    <button class="btn btn-outline-primary" type="button" onclick="saveNote('new',$('#new_note').val())">????</button>
  </div>`);
}

function showNotesModal(){
  drawNotes();
  $('#notes_modal').modal('show');
}

function drawTypes(){
  $.get( "resources/index.php?type=types", function( data ) {
    var list = JSON.parse(data);
    $.each(list, function(key, val){
      $('#type_list').append($('<option>').val(key).text(val));
      $('#edit_type').append($('<option>').val(key).text(val));
      $('#type_edit_list').append(`<li class="list-group-item list-group-item-action">
      <div class="input-group mb-3">
        <button class="btn btn-outline-danger" type="button" onclick="delType(`+key+`)">???????</button>
        <input type="text" class="form-control" id="type`+key+`" value="`+val+`" />
        <button class="btn btn-outline-primary" type="button" onclick="saveType(`+key+`,$('#type`+key+`').val())">????</button>
        </div>`);
    });
    $('#type_edit_list').append(`<li class="list-group-item list-group-item-action">
    <div class="input-group mb-3">
        <span class="input-group-text">New Recipe Type</span>
      <input type="text" class="form-control" id="new_type" value="" placeholder="New Recipe Type" />
      <button class="btn btn-outline-primary" type="button" onclick="saveType('new',$('#new_type').val())">????</button>
    </div>`);
  });    
}

function loadTypesModal(){
    $('#types_modal').modal('show');
}

function delType(id,name){
    var x = confirm('Are you sure you want to delete the '+name+' recipe type?');
    if (x){
        $.get("resources/index.php?type=checktype&id="+id,function(data){
            if (data == 0){
                var variables = {"type":"deltype","id":id};
                $.post("resources/index.php",variables);
            }   else    {
                alert(name+" can't be deleted as there are currently "+data+" recipes assigned to it.  Change these recipe types first.");
            }
        });
        location.reload();
    }
}

function saveType(id, type){
  if (type == ""){
    alert('Type cannot be blank');
    return;
  }
  if (id == "new"){
      var variables = {"type" : "newtype","name" : type};
  }   else    {
      var variables = {"type" : "edittype", "id" : id, "name" : type};
  }
  $.post("resources/index.php", variables);
  location.reload();
}

function delNote(id){
  var x = confirm('Are you sure you want to delete the this note?');
  if (x){
    var variables = {"type":"delnote","id":id};
    $.post("resources/index.php",variables);
    location.reload();
  }
}

function saveNote(id, type){
  if (type == ""){
    alert('Type cannot be blank');
    return;
  }
  if (id == "new"){
    recipe_id = active_recipe;
    var variables = {"type" : "newnote","name" : type, "recipe_id" : recipe_id};
  }   else    {
    var variables = {"type" : "editnote", "id" : id, "name" : type};
  }
  $.post("resources/index.php", variables);
  location.reload();
}


async function searchRecipes(){
  if ($.fn.DataTable.isDataTable('#recipes_table')){
    $('#recipes_table').DataTable().destroy();
  }        
  $('#search_body').html('');
  await $.get( "resources/index.php?type=recipes", function( data ) {
    data = JSON.parse(data);
    $('#search_body').html('');
    $.each( data, function( key, val ) {
      $('#search_body').append('<tr><td onclick="loadRecipe('+val.id+')">'+val.name+'</td><td>'+val.search+'</td></tr>');
      var r = new Recipe(val.id, val.name, val.author, val.ingredients, val.directions, val.type, val.type_id, val.notes, val.images);
      recipes[val.id] = r;
      names.push([val.name]);
      if (key+1 == data.length){
        $('#recipes_table').DataTable({
          "order": [ 0, 'asc' ],
          paging: false,
          "columnDefs": [
            { "visible": false, "targets": 1 }
          ]
        });
      }
    })  
  });
  return;
}