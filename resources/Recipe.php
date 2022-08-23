<?
class Recipe {
    public $id;
    public $name;
    public $author;
    public $type;
    public $type_id;
    public $directions;
    public $ingredients = [];
    public $notes = [];
    public $images = [];

    function __construct($id) {
        $this->id = $id;
        $dbConn = new DataConn();
        $vals = $dbConn->queryData("select r.name, r.author, r.directions, t.type, r.type_id from recipes r join types t on r.type_id = t.id  where r.id = ?", [$id])[0];
        $this->name = $vals["name"];
        $this->author = $vals["author"];
        $this->type = $vals["type"];
        $this->type_id = $vals["type_id"];
        $this->directions = $vals["directions"];
        $r = $dbConn->queryData("select id, ordinal,ingredient from ingredients where recipe_id = ? order by ordinal", [$id]) ;
        if(is_array($r)){
            foreach ($r as $key => $val){
                $this->ingredients[$val["id"]]["ingredient"] = $val["ingredient"];
                $this->ingredients[$val["id"]]["ordinal"] = $val["ordinal"];
            }
        }
        $i = $dbConn->queryData("select * from notes where recipe_id = ?", [$id]);
        if (is_array($i)){
            foreach ($i as $key => $val){
                $this->notes[$val["id"]] = $val["note"];
            }
        }
        $m = $dbConn->queryData("select id, filename,description from images where recipe_id = ?", [$id]);
        if (is_array($m)){
            foreach ($m as $key => $val){
                $this->images[] = [
                    'id' => $val["id"],
                    'filename' => $val["filename"],
                    'description' => $val["description"]
                ];
            }
        }
    }

    public static function editRecipe($id, $name, $author, $type_id, $directions, $ingredients) {
        $dbConn = new DataConn();
        /* update recipe */
        $query = "update recipes set name = ?, author = ?, directions = ?, type_id = ? where id = ?";
        $vars = [$name, $author, $directions, $type_id, $id];
        $dbConn->insUpDel($query, $vars);

        /* remove old ingredients */        
        $query = "delete from ingredients where recipe_id = ?";
        $vars = [$id];
        $dbConn->insUpDel($query, $vars);
        
        /*  insert new ingredients */
        foreach ($ingredients as $key => $ing){
            $query = "insert into ingredients (recipe_id, ordinal, ingredient) VALUES (?,?,?)";
            $vars = [$id, $key, $ing];
            $dbConn->insUpDel($query, $vars);
        }
    }

    public static function newRecipe($name, $author, $type_id, $directions, $ingredients) {
        $dbConn = new DataConn();
        /* create recipe */
        $query = "insert into  recipes (name, author, directions, type_id) VALUES (?,?,?,?)";
        $vars = [$name, $author, $directions, $type_id];
        $dbConn->insUpDel($query, $vars);

        /* get inserted recipe id */
        $query = "select last_insert_rowid() id;";
        $id = $dbConn->queryData($query)[0]['id'];
        
        /*  insert new ingredients */
        foreach ($ingredients as $key => $ing){
            $query = "insert into ingredients (recipe_id, ordinal, ingredient) VALUES (?,?,?)";
            $vars = [$id, $key, $ing];
            $dbConn->insUpDel($query, $vars);
        }
    }

    public static function delRecipe($id){
        $dbConn = new DataConn();
        $query[] = "delete from notes where recipe_id = ?";
        $query[] = "delete from ingredients where recipe_id = ?";
        $query[] = "delete from recipes where id = ?";
        //need to implement the image delete feature as well
        foreach ($query as $line){
            $dbConn->insUpDel($line, [$id]);
        }
    }
}
