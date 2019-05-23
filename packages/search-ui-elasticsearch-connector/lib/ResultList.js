"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ResultItem = _interopRequireDefault(require("./ResultItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO This was copied from App Search api client, should probably have a
// specific type just for Search UI

/**
 * A list of ResultItems and additional information returned by a search request
 */
var ResultList = function ResultList(rawResults, rawInfo) {
  _classCallCheck(this, ResultList);

  this.rawResults = rawResults;
  this.rawInfo = rawInfo;
  var results = new Array();
  rawResults.forEach(function (data) {
    results.push(new _ResultItem.default(data));
  });
  this.results = results;
  this.info = rawInfo;
};

exports.default = ResultList;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN1bHRMaXN0LmpzIl0sIm5hbWVzIjpbIlJlc3VsdExpc3QiLCJyYXdSZXN1bHRzIiwicmF3SW5mbyIsInJlc3VsdHMiLCJBcnJheSIsImZvckVhY2giLCJkYXRhIiwicHVzaCIsIlJlc3VsdEl0ZW0iLCJpbmZvIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQUVBOzs7Ozs7QUFFQTtBQUNBOztBQUVBOzs7SUFHcUJBLFUsR0FDbkIsb0JBQVlDLFVBQVosRUFBd0JDLE9BQXhCLEVBQWlDO0FBQUE7O0FBQy9CLE9BQUtELFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsT0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBRUEsTUFBTUMsT0FBTyxHQUFHLElBQUlDLEtBQUosRUFBaEI7QUFDQUgsRUFBQUEsVUFBVSxDQUFDSSxPQUFYLENBQW1CLFVBQUFDLElBQUksRUFBSTtBQUN6QkgsSUFBQUEsT0FBTyxDQUFDSSxJQUFSLENBQWEsSUFBSUMsbUJBQUosQ0FBZUYsSUFBZixDQUFiO0FBQ0QsR0FGRDtBQUlBLE9BQUtILE9BQUwsR0FBZUEsT0FBZjtBQUNBLE9BQUtNLElBQUwsR0FBWVAsT0FBWjtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJlc3VsdEl0ZW0gZnJvbSBcIi4vUmVzdWx0SXRlbVwiO1xuXG4vLyBUT0RPIFRoaXMgd2FzIGNvcGllZCBmcm9tIEFwcCBTZWFyY2ggYXBpIGNsaWVudCwgc2hvdWxkIHByb2JhYmx5IGhhdmUgYVxuLy8gc3BlY2lmaWMgdHlwZSBqdXN0IGZvciBTZWFyY2ggVUlcblxuLyoqXG4gKiBBIGxpc3Qgb2YgUmVzdWx0SXRlbXMgYW5kIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gcmV0dXJuZWQgYnkgYSBzZWFyY2ggcmVxdWVzdFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRMaXN0IHtcbiAgY29uc3RydWN0b3IocmF3UmVzdWx0cywgcmF3SW5mbykge1xuICAgIHRoaXMucmF3UmVzdWx0cyA9IHJhd1Jlc3VsdHM7XG4gICAgdGhpcy5yYXdJbmZvID0gcmF3SW5mbztcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBuZXcgQXJyYXkoKTtcbiAgICByYXdSZXN1bHRzLmZvckVhY2goZGF0YSA9PiB7XG4gICAgICByZXN1bHRzLnB1c2gobmV3IFJlc3VsdEl0ZW0oZGF0YSkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZXN1bHRzID0gcmVzdWx0cztcbiAgICB0aGlzLmluZm8gPSByYXdJbmZvO1xuICB9XG59XG4iXX0=