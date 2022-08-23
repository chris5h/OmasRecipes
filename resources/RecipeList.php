<?
class RecipeList {
    public $recipes;

    function __construct() {
        $bob = new DataConn();
        foreach ($bob->queryData("select id from recipes") as $line){
            $this->recipes[] = new Recipe($line["id"]);
        }
    }
}