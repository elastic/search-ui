function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import elasticsearch from "elasticsearch";
import { toResultList } from "./responseAdapters";

var ElasticsearchAPIConnector =
/*#__PURE__*/
function () {
  function ElasticsearchAPIConnector(_ref) {
    var indexName = _ref.indexName,
        host = _ref.host;

    _classCallCheck(this, ElasticsearchAPIConnector);

    this.host = host;
    this.indexName = indexName;
    this.client = new elasticsearch.Client({
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
        return toResultList(body);
      });
    }
  }]);

  return ElasticsearchAPIConnector;
}();

export { ElasticsearchAPIConnector as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FbGFzdGljc2VhcmNoQVBJQ29ubmVjdG9yLmpzIl0sIm5hbWVzIjpbImVsYXN0aWNzZWFyY2giLCJ0b1Jlc3VsdExpc3QiLCJFbGFzdGljc2VhcmNoQVBJQ29ubmVjdG9yIiwiaW5kZXhOYW1lIiwiaG9zdCIsImNsaWVudCIsIkNsaWVudCIsInF1ZXJ5IiwiZG9jdW1lbnRJZCIsInRhZ3MiLCJzZWFyY2hUZXJtIiwic2VhcmNoT3B0aW9ucyIsIm11bHRpX21hdGNoIiwibWF0Y2hfYWxsIiwic2VhcmNoIiwiaW5kZXgiLCJib2R5IiwidGhlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBT0EsYUFBUCxNQUEwQixlQUExQjtBQUNBLFNBQVNDLFlBQVQsUUFBNkIsb0JBQTdCOztJQUVxQkMseUI7OztBQUNuQiwyQ0FBaUM7QUFBQSxRQUFuQkMsU0FBbUIsUUFBbkJBLFNBQW1CO0FBQUEsUUFBUkMsSUFBUSxRQUFSQSxJQUFROztBQUFBOztBQUMvQixTQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLRCxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFNBQUtFLE1BQUwsR0FBYyxJQUFJTCxhQUFhLENBQUNNLE1BQWxCLENBQXlCO0FBQ3JDRixNQUFBQSxJQUFJLEVBQUpBO0FBRHFDLEtBQXpCLENBQWQ7QUFHRCxHLENBRUQ7Ozs7O2lDQUNtQztBQUFBLFVBQTNCRyxLQUEyQixTQUEzQkEsS0FBMkI7QUFBQSxVQUFwQkMsVUFBb0IsU0FBcEJBLFVBQW9CO0FBQUEsVUFBUkMsSUFBUSxTQUFSQSxJQUFRO0FBRWxDLEssQ0FEQztBQUdGOzs7OzJCQUNPQyxVLEVBQVlDLGEsRUFBZTtBQUNoQyxVQUFNSixLQUFLLEdBQUdHLFVBQVUsR0FDcEI7QUFDRUUsUUFBQUEsV0FBVyxFQUFFO0FBQ1hMLFVBQUFBLEtBQUssRUFBRUc7QUFESTtBQURmLE9BRG9CLEdBTXBCO0FBQUVHLFFBQUFBLFNBQVMsRUFBRTtBQUFiLE9BTko7QUFRQSxhQUFPLEtBQUtSLE1BQUwsQ0FDSlMsTUFESSxDQUNHO0FBQ05DLFFBQUFBLEtBQUssRUFBRSxLQUFLWixTQUROO0FBRU5hLFFBQUFBLElBQUksRUFBRTtBQUNKVCxVQUFBQSxLQUFLLEVBQUxBO0FBREk7QUFGQSxPQURILEVBT0pVLElBUEksQ0FPQyxVQUFBRCxJQUFJO0FBQUEsZUFBSWYsWUFBWSxDQUFDZSxJQUFELENBQWhCO0FBQUEsT0FQTCxDQUFQO0FBUUQ7Ozs7OztTQWhDa0JkLHlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVsYXN0aWNzZWFyY2ggZnJvbSBcImVsYXN0aWNzZWFyY2hcIjtcbmltcG9ydCB7IHRvUmVzdWx0TGlzdCB9IGZyb20gXCIuL3Jlc3BvbnNlQWRhcHRlcnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxhc3RpY3NlYXJjaEFQSUNvbm5lY3RvciB7XG4gIGNvbnN0cnVjdG9yKHsgaW5kZXhOYW1lLCBob3N0IH0pIHtcbiAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgIHRoaXMuaW5kZXhOYW1lID0gaW5kZXhOYW1lO1xuICAgIHRoaXMuY2xpZW50ID0gbmV3IGVsYXN0aWNzZWFyY2guQ2xpZW50KHtcbiAgICAgIGhvc3RcbiAgICB9KTtcbiAgfVxuXG4gIC8vZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGNsaWNrKHsgcXVlcnksIGRvY3VtZW50SWQsIHRhZ3MgfSkge1xuICAgIC8vVE9ET1xuICB9XG5cbiAgLy9lc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgc2VhcmNoKHNlYXJjaFRlcm0sIHNlYXJjaE9wdGlvbnMpIHtcbiAgICBjb25zdCBxdWVyeSA9IHNlYXJjaFRlcm1cbiAgICAgID8ge1xuICAgICAgICAgIG11bHRpX21hdGNoOiB7XG4gICAgICAgICAgICBxdWVyeTogc2VhcmNoVGVybVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgOiB7IG1hdGNoX2FsbDoge30gfTtcblxuICAgIHJldHVybiB0aGlzLmNsaWVudFxuICAgICAgLnNlYXJjaCh7XG4gICAgICAgIGluZGV4OiB0aGlzLmluZGV4TmFtZSxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIHF1ZXJ5XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihib2R5ID0+IHRvUmVzdWx0TGlzdChib2R5KSk7XG4gIH1cbn1cbiJdfQ==