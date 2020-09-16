$(document).ready(function () {
  Even.backToTop();
  Even.mobileNavbar();
  Even.toc();
  Even.fancybox();
  addCopyButton();
});

Even.responsiveTable();
Even.flowchart();
Even.sequence();

if (window.hljs) {
  hljs.initHighlighting();
  Even.highlight();
} else {
  Even.chroma();
}

// copy codes
// based on https://xinyo.org/archives/66226

function fold() {
  var $hl = $(".highlight");
  if (window.g_need_fold === 1) {
    // 代码需要折叠
    $hl.addClass("fold");
    $hl.on("click", function () {
      if ($hl._fold) {
        $hl.removeClass("fold");
      } else {
        $hl.addClass("fold");
      }
      $hl._fold = !$hl._fold;
    });
  }
}

function toggleFoldName(el) {
  return el._fold ? "展开" : "折叠";
}

function addCopyButton() {
  //用 div 包裹 figure 便于定位
  $(".src .highlight").wrap('<div class="highlight-wrapper"></div>');
  //添加复制按钮
  var $hl = $(".highlight");
  fold(); // 代码折叠
  let copyBtnTpl = "";
  if (window.g_need_fold === 1) {
    $hl._fold = true;
    copyBtnTpl =
      '<div class="fold-code btn btn-outline-secondary fold">' +
      toggleFoldName($hl) +
      "</div>";
  }
  $hl.before(
    copyBtnTpl + '<div class="copy-code btn btn-outline-secondary">复制</div>'
  );

  $(".fold-code").on("click", function () {
    var fn = $hl._fold ? "removeClass" : "addClass";
    $hl._fold = !$hl._fold;
    $(this).text(toggleFoldName($hl));
    $hl[fn]("fold");
  });

  //为复制按钮添加click事件
  $(".copy-code").on("click", function () {
    //初始化
    $("textarea").remove("#targetId");

    //获取对应的代码
    var codeText = "";
    $(this)
      .next("div.highlight")
      .find("pre.chroma>code")
      .each(function (i) {
        // 过滤掉行号的那个 pre
        if (i > 0) {
          codeText += $(this).text() + "\n";
        }
      });

    //添加 <textarea> DOM节点，将获取的代码写入
    var target = document.createElement("textarea");
    target.style.opacity = 0;
    target.style.left = "-9999px";
    target.id = "targetId";
    $(this).append(target);
    target.textContent = codeText;

    //选中textarea内的代码
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // 复制选中的内容
    document.execCommand("copy");

    //删除添加的节点
    $("textarea").remove("#targetId");
    $(this).html("成功");
    var thisCopied = $(this);
    setTimeout(function () {
      thisCopied.html("复制");
    }, 1200);
  });
}
