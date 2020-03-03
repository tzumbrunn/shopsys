<?php

declare(strict_types=1);

namespace Shopsys\Releaser\Tests\FileManipulator\ChangelogFileManipulator;

use PharIo\Version\Version;
use PHPUnit\Framework\TestCase;
use Shopsys\Releaser\FileManipulator\ChangelogFileManipulator;
use Symplify\SmartFileSystem\SmartFileInfo;

final class ChangelogFileManipulatorTest extends TestCase
{
    public function test(): void
    {
        $changelogFileManipulator = new ChangelogFileManipulator('shopsys/shopsys');

        $changedContent = $changelogFileManipulator->processFileToString(
            new SmartFileInfo(__DIR__ . '/Source/CHANGELOG-before.md'),
            new Version('v1.0.0'),
            new Version('v0.0.9')
        );

        $this->assertStringMatchesFormatFile(__DIR__ . '/Source/CHANGELOG-after.md', $changedContent);
    }
}
