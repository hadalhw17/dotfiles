describe('background handlers', function () {
  var MSG = window.vkScrobbler.contentMessages;
  var Actions = window.vkScrobbler.BackgroundActions;

  var fakeKey = 'fffff';
  var fakeName = 'user';
  var gaq;
  var fakeTrackInfo = {artist: 'Muse', title: 'Dead Inside'};
  var selfResolvePromiseFactory = function (resp) {
    return {
      then: function (callback) {
        callback(resp || {});
      }
    };
  };
  var handlers;

  beforeEach(function () {
    this.sinon = sinon.sandbox.create();
    this.sinon.stub(window.console, 'info');
    window._gaq = gaq = this.sinon.stub({
      push: function () {}
    });

    handlers = new Actions(fakeKey, fakeName);
    handlers.api = this.sinon.stub(handlers.api);
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('Should init', function () {
    handlers.should.be.defined;
    handlers.api.should.be.defined;
  });

  it('Should handle scrobble request', function () {
    handlers.api.scrobble.returns(selfResolvePromiseFactory());
    handlers[MSG.NEED_SCROOBLE](fakeTrackInfo);
    handlers.api.scrobble.should.have.been.calledWith(fakeTrackInfo);
  });

  it('Should handle nowPlaying request', function () {
    handlers.api.nowPlaying.returns(selfResolvePromiseFactory());
    handlers[MSG.NOW_PLAYING](fakeTrackInfo);
    handlers.api.nowPlaying.should.have.been.calledWith(fakeTrackInfo);
  });

  it('Should handle makeLoved request', function () {
    handlers.api.makeLoved.returns(selfResolvePromiseFactory());
    handlers[MSG.NEED_LOVE](fakeTrackInfo);
    handlers.api.makeLoved.should.have.been.calledWith(fakeTrackInfo);
  });

  it('Should handle makeNotLoved request', function () {
    handlers.api.makeNotLoved.returns(selfResolvePromiseFactory());
    handlers[MSG.NOT_NEED_LOVE](fakeTrackInfo);
    handlers.api.makeNotLoved.should.have.been.calledWith(fakeTrackInfo);
  });

  it('Should handle getTrackInfo request', function () {
    handlers.api.getTrackInfo.returns(selfResolvePromiseFactory());
    handlers[MSG.GET_TRACK_INFO](fakeTrackInfo);
    handlers.api.getTrackInfo.should.have.been.calledWith(fakeTrackInfo);
  });
  it('Should handle togglePause request', function () {
    handlers[MSG.TOGGLE_PAUSE](fakeTrackInfo);
    gaq.push.should.have.been.called;
  });
});
