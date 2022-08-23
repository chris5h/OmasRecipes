<?
class DataConn{
    private $pdo;

    function __construct() {
        try {
            $this->pdo = new PDO("sqlite:recipes.db");
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    function queryData($query, $vars = null){
        $stmt = $this->pdo->query($query);
        if (is_array($vars))
        {
            $stmt->execute($vars);
        }
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
        {
            $results[] = $row;
        }

        if (is_array($results)){
            return $results;
        }   else    {
            return false;
        }
    }

    function insUpDel($query, $vars = null){
        $this->pdo->prepare($query)->execute($vars);
    }    
}
