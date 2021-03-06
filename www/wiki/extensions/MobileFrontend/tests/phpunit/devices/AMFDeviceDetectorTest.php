<?php

namespace Tests\MobileFrontend\Devices;

use MediaWikiTestCase;
use WebRequest;
use MobileFrontend\Devices\AMFDeviceDetector;

/**
 * @group MobileFrontend
 */
class AMFDeviceDetectorTest extends MediaWikiTestCase {

	/**
	 * @var WebRequest
	 */
	private $request;

	/**
	 * @var AMFDeviceDetector
	 */
	private $detector;

	protected function setUp() {
		parent::setUp();

		$this->request = new WebRequest();
		$this->detector = new AMFDeviceDetector();
	}

	/**
	 * @dataProvider provideIsMobileDevice
	 */
	public function testIsMobileDevice( $server, $expectedIsMobileDevice ) {
		$isMobileDevice =
			$this->detector->detectDeviceProperties( $this->request, $server )
				->isMobileDevice();

		$this->assertEquals( $expectedIsMobileDevice, $isMobileDevice );
	}

	public static function provideIsMobileDevice() {
		return [
			[
				[ 'AMF_DEVICE_IS_MOBILE' => 'true' ],
				true,
			],
			[
				[ 'AMF_DEVICE_IS_MOBILE' => 'false' ],
				false,
			],
		];
	}

	/**
	 * @dataProvider provideIsTabletDevice
	 */
	public function testIsTabletDevice( $server, $expectedIsTabletDevice ) {
		$isTabletDevice =
			$this->detector->detectDeviceProperties( $this->request, $server )
				->isTabletDevice();

		$this->assertEquals( $expectedIsTabletDevice, $isTabletDevice );
	}

	public static function provideIsTabletDevice() {
		return [
			[
				[ 'AMF_DEVICE_IS_TABLET' => 'true' ],
				true,
			],
			[
				[ 'AMF_DEVICE_IS_TABLET' => 'false' ],
				false,
			],
		];
	}

	public function test_it_should_handle_no_AMF_environment_variables() {
		$this->assertNull(
			$this->detector->detectDeviceProperties( $this->request, [] )
		);
	}
}
