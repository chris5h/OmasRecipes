<?
require_once 'DataConn.php';
require_once 'Recipe.php';
require_once 'RecipeList.php';
if ($_POST){
    $bob = new DataConn();
    if ($_POST['type'] == "del"){
        Recipe::delRecipe($_POST['id']);
    } elseif ($_POST['type'] == 'deltype'){
        $bob->insUpDel("delete from types where id = ?",[$_POST["id"]]);
    } elseif ($_POST['type'] == 'edittype'){
        $bob->insUpDel("update types set type = ? where id = ?",[$_POST['name'],$_POST["id"]]);
    } elseif ($_POST['type'] == "newtype"){
        $bob->insUpDel("insert into types (type) values (?)",[$_POST["name"]]);
    } elseif ($_POST['type'] == 'delnote'){
        $bob->insUpDel("delete from notes where id = ?",[$_POST["id"]]);
    } elseif ($_POST['type'] == 'editnote'){
        $bob->insUpDel("update notes set note = ? where id = ?",[$_POST['name'],$_POST["id"]]);
    } elseif ($_POST['type'] == "newnote"){
        $bob->insUpDel("insert into notes (recipe_id, note) values (?,?)",[$_POST['recipe_id'],$_POST["name"]]);
    } elseif ($_POST['type'] == "delimage"){
        $bob->insUpDel("delete from images where id = ?",[$_POST["id"]]);
    } elseif ($_POST['type'] == "editdesc"){
        $bob->insUpDel("update images set description = ? where id = ?",[$_POST['desc'],$_POST["id"]]);
    } elseif ($_POST['type'] == "newimage"){
        $maxDim = 1000;
        foreach($_FILES["myfile"]["tmp_name"] as $key => $val){
            // start foreach
            $file_name = $_FILES['myfile']['tmp_name'][$key];
            $img_type = $_FILES['myfile']['type'][$key];
            list($width, $height, $type, $attr) = getimagesize( $file_name );
            if ( $width > $maxDim || $height > $maxDim ) {
                $target_filename = $file_name;
                $ratio = $width/$height;
                if( $ratio > 1) {
                    $new_width = $maxDim;
                    $new_height = $maxDim/$ratio;
                } else {
                    $new_width = $maxDim*$ratio;
                    $new_height = $maxDim;
                }
                $src = imagecreatefromstring( file_get_contents( $file_name ) );
                $dst = imagecreatetruecolor( $new_width, $new_height );
                imagecopyresampled( $dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
                imagedestroy( $src );
                $img_type == "image/png" ? imagepng( $dst, $target_filename ) : imagejpeg( $dst, $target_filename ); // adjust format as needed
                imagedestroy( $dst );
            }
            $ext = $img_type == "image/png" ? ".png" : ".jpg";
            $bob = new DataConn();
            $query = "insert into images (recipe_id,filename,description) values (?, hex(randomblob(16))||?,?);";
            $params = [$_POST['recipe_id'],$ext,$_POST['description']];
            $bob->insUpDel($query, $params);
            $new_name = $bob->queryData('select * from images where id = last_insert_rowid()')[0]['filename'];
            move_uploaded_file($file_name, "../images/uploads/$new_name");
            //end foreach
        }
        
        header("Location: ../admin.html");
        die();

    }   else    {
        switch ($_POST['id']) {
            case 'new':
                error_log(print_r($_POST, true),0);
                Recipe::newRecipe($_POST['name'],$_POST['author'],$_POST['type_id'],$_POST['directions'], $_POST['ingredients']);
                break;
            default:
                Recipe::editRecipe($_POST['id'],$_POST['name'],$_POST['author'],$_POST['type_id'],$_POST['directions'], $_POST['ingredients']);
                break;
        }
    }
    die();
}   else if($_GET)    {
    $bob = new DataConn();
    switch ($_GET['type']){
        case 'recipes':
            $query = $bob->queryData("select id from recipes");
            foreach ($query as $line){
                $recipes[] = (Array) new Recipe($line["id"]);
            }
            foreach ($recipes as $key => $line){
                unset($lstat);
                foreach ($line["ingredients"] as $thing){
                    $lstat .= $thing["ingredient"]." ";
                }
                $recipes[$key]["search"] = $lstat;
            }
            print json_encode($recipes, JSON_PRETTY_PRINT);
            break;
        case 'types':
            $results = [];
            foreach ($bob->queryData("select id,type from types order by type") as $line){
                $results[$line["id"]] = $line["type"];
            }
            print json_encode($results, JSON_PRETTY_PRINT);
            break;
        case 'checktype':
            foreach ($bob->queryData("select count(*) [count] from recipes where type_id = ?", [$_GET['id']]) as $line){
                print $line["count"];
            }
            break;
    }
}
die();