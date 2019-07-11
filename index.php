<?php
include_once('./_common.php');
include_once('./_head.sub.php');

add_javascript('<script src="./js/app.min.js"></script>');
add_stylesheet('<link rel="stylesheet" href="./css/style.css">');
?>

<div id="chat_wrap" class="wrap_chat">
    <div>
        <div class="header">
            <div class="title_area">채 팅</div>
        </div>
    </div>
    <div>
        <div class="cont_chat">
            <ul>
            </ul>
        </div>
        <div class="box_chat">
            <div class="frame_msg">
                <textarea id="msgInputArea" class="tf_msg"></textarea>
            </div>
        </div>
    </div>
</div>

<script>
var userId = "<?php echo $member['mb_id'] ?>";
var usernick = "<?php echo $member['mb_nick'] ?>";
var userlevel = "<?php echo $member['mb_level'] ?>";
</script>

<script src="./js/chatApp.js?ver=<?php echo G5_JS_VER ?>"></script>

<?php
include_once('./_tail.sub.php');
?>