"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _elasticsearch = _interopRequireDefault(require("elasticsearch"));

var _responseAdapters = require("./responseAdapters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ElasticsearchAPIConnector =
/*#__PURE__*/
function () {
  function ElasticsearchAPIConnector(_ref) {
    var indexName = _ref.indexName,
        host = _ref.host;

    _classCallCheck(this, ElasticsearchAPIConnector);

    this.host = host;
    this.indexName = indexName;
    this.client = new _elasticsearch.default.Client({
      host: host
    });
  } //eslint-disable-next-line


  _createClass(ElasticsearchAPIConnector, [{
    key: "click",
    value: function click(_ref2) {
      var query = _ref2.query,
          documentId = _ref2.documentId,
          tags = _ref2.tags;
    } //TODO
    //eslint-disable-next-line

  }, {
    key: "search",
    value: function search(searchTerm, searchOptions) {
      var query = searchTerm ? {
        multi_match: {
          query: searchTerm
        }
      } : {
        match_all: {}
      };
      return this.client.search({
        index: this.indexName,
        body: {
          query: query
        }
      }).then(function (body) {
        return (0, _responseAdapters.toResultList)(body);
      });
    }
  }]);

  return ElasticsearchAPIConnector;
}();

exports.default = ElasticsearchAPIConnector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FbGFzdGljc2VhcmNoQVBJQ29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbIkVsYXN0aWNzZWFyY2hBUElDb25uZWN0b3IiLCJpbmRleE5hbWUiLCJob3N0IiwiY2xpZW50IiwiZWxhc3RpY3NlYXJjaCIsIkNsaWVudCIsInF1ZXJ5IiwiZG9jdW1lbnRJZCIsInRhZ3MiLCJzZWFyY2hUZXJtIiwic2VhcmNoT3B0aW9ucyIsIm11bHRpX21hdGNoIiwibWF0Y2hfYWxsIiwic2VhcmNoIiwiaW5kZXgiLCJib2R5IiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7O0lBRXFCQSx5Qjs7O0FBQ25CLDJDQUFpQztBQUFBLFFBQW5CQyxTQUFtQixRQUFuQkEsU0FBbUI7QUFBQSxRQUFSQyxJQUFRLFFBQVJBLElBQVE7O0FBQUE7O0FBQy9CLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtELFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0EsU0FBS0UsTUFBTCxHQUFjLElBQUlDLHVCQUFjQyxNQUFsQixDQUF5QjtBQUNyQ0gsTUFBQUEsSUFBSSxFQUFKQTtBQURxQyxLQUF6QixDQUFkO0FBR0QsRyxDQUVEOzs7OztpQ0FDbUM7QUFBQSxVQUEzQkksS0FBMkIsU0FBM0JBLEtBQTJCO0FBQUEsVUFBcEJDLFVBQW9CLFNBQXBCQSxVQUFvQjtBQUFBLFVBQVJDLElBQVEsU0FBUkEsSUFBUTtBQUVsQyxLLENBREM7QUFHRjs7OzsyQkFDT0MsVSxFQUFZQyxhLEVBQWU7QUFDaEMsVUFBTUosS0FBSyxHQUFHRyxVQUFVLEdBQ3BCO0FBQ0VFLFFBQUFBLFdBQVcsRUFBRTtBQUNYTCxVQUFBQSxLQUFLLEVBQUVHO0FBREk7QUFEZixPQURvQixHQU1wQjtBQUFFRyxRQUFBQSxTQUFTLEVBQUU7QUFBYixPQU5KO0FBUUEsYUFBTyxLQUFLVCxNQUFMLENBQ0pVLE1BREksQ0FDRztBQUNOQyxRQUFBQSxLQUFLLEVBQUUsS0FBS2IsU0FETjtBQUVOYyxRQUFBQSxJQUFJLEVBQUU7QUFDSlQsVUFBQUEsS0FBSyxFQUFMQTtBQURJO0FBRkEsT0FESCxFQU9KVSxJQVBJLENBT0MsVUFBQUQsSUFBSTtBQUFBLGVBQUksb0NBQWFBLElBQWIsQ0FBSjtBQUFBLE9BUEwsQ0FBUDtBQVFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVsYXN0aWNzZWFyY2ggZnJvbSBcImVsYXN0aWNzZWFyY2hcIjtcbmltcG9ydCB7IHRvUmVzdWx0TGlzdCB9IGZyb20gXCIuL3Jlc3BvbnNlQWRhcHRlcnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxhc3RpY3NlYXJjaEFQSUNvbm5lY3RvciB7XG4gIGNvbnN0cnVjdG9yKHsgaW5kZXhOYW1lLCBob3N0IH0pIHtcbiAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgIHRoaXMuaW5kZXhOYW1lID0gaW5kZXhOYW1lO1xuICAgIHRoaXMuY2xpZW50ID0gbmV3IGVsYXN0aWNzZWFyY2guQ2xpZW50KHtcbiAgICAgIGhvc3RcbiAgICB9KTtcbiAgfVxuXG4gIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGNsaWNrKHsgcXVlcnksIGRvY3VtZW50SWQsIHRhZ3MgfSkge1xuICAgIC8vVE9ET1xuICB9XG5cbiAgLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgc2VhcmNoKHNlYXJjaFRlcm0sIHNlYXJjaE9wdGlvbnMpIHtcbiAgICBjb25zdCBxdWVyeSA9IHNlYXJjaFRlcm1cbiAgICAgID8ge1xuICAgICAgICAgIG11bHRpX21hdGNoOiB7XG4gICAgICAgICAgICBxdWVyeTogc2VhcmNoVGVybVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgOiB7IG1hdGNoX2FsbDoge30gfTtcblxuICAgIHJldHVybiB0aGlzLmNsaWVudFxuICAgICAgLnNlYXJjaCh7XG4gICAgICAgIGluZGV4OiB0aGlzLmluZGV4TmFtZSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHF1ZXJ5XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihib2R5ID0+IHRvUmVzdWx0TGlzdChib2R5KSk7XG4gIH1cbn1cbiJdfQ==