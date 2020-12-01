var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AnimMode = (function () {
    function AnimMode() {
    }
    AnimMode.ANIM_ROT = 0;
    AnimMode.ANIM_SCALE = 1;
    return AnimMode;
}());
__reflect(AnimMode.prototype, "AnimMode");
//# sourceMappingURL=AnimMode.js.map