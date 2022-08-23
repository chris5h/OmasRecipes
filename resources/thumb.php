<?
$file_name = '../images/uploads/'.$_GET['image'];
$imagedestroy = explode('.', $_GET['image'])[1];
$maxDim = $_GET['size'];
list($width, $height, $type, $attr) = getimagesize( $file_name );
$target_filename = $file_name;
$ratio = $width/$height;
if( $ratio > 1) {
    $new_width = $maxDim;
    $new_height = round($maxDim/$ratio);
} else {
    $new_width = round($maxDim*$ratio,0);
    $new_height = $maxDim;
}
$src = imagecreatefromstring( file_get_contents( $file_name ) );
$dst = imagecreatetruecolor( $new_width, $new_height );
imagecopyresampled( $dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
header("Content-Type: image/".($img_type == "png" ? $img_type : "jpg"));
// header("Content-Length: " . filesize(imagepng( $dst )));
$img_type == "png" ? imagepng( $dst ) : imagejpeg( $dst ); // adjust format as needed
imagedestroy( $src );
imagedestroy( $dst );
exit;
?>